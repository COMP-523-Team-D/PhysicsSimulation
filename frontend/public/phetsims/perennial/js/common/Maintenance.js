// Copyright 2018, University of Colorado Boulder

/**
 * The main persistent state-bearing object for maintenance releases. Can be loaded from or saved to a dedicated file.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

'use strict';

const assert = require( 'assert' );
const build = require( './build' );
const checkoutMaster = require( './checkoutMaster' );
const checkoutTarget = require( './checkoutTarget' );
const ChipperVersion = require( './ChipperVersion' );
const execute = require( './execute' );
const fs = require( 'fs' );
const getActiveRepos = require( './getActiveRepos' );
const getBranches = require( './getBranches' );
const getDependencies = require( './getDependencies' );
const gitCheckout = require( './gitCheckout' );
const gitCherryPick = require( './gitCherryPick' );
const gitCreateBranch = require( './gitCreateBranch' );
const gitIsClean = require( './gitIsClean' );
const gitPull = require( './gitPull' );
const gitPush = require( './gitPush' );
const gitRevParse = require( './gitRevParse' );
const ModifiedBranch = require( './ModifiedBranch' );
const npmUpdate = require( './npmUpdate' );
const Patch = require( './Patch' );
const production = require( '../grunt/production' );
const rc = require( '../grunt/rc' );
const ReleaseBranch = require( './ReleaseBranch' );
const repl = require( 'repl' );
const updateDependenciesJSON = require( './updateDependenciesJSON' );
const winston = require( 'winston' );

// constants
const MAINTENANCE_FILE = '.maintenance.json';

// const PUBLIC_FUNCTIONS = [
//   'addAllNeededPatches',
//   'addNeededPatch',
//   'addNeededPatches',
//   'addNeededPatchesAfter',
//   'addNeededPatchesBefore',
//   'addNeededPatchesBuildFilter',
//   'addNeededPatchReleaseBranch',
//   'addPatchSHA',
//   'applyPatches',
//   'buildAll',
//   'checkBranchStatus',
//   'checkoutBranch',
//   'createPatch',
//   'deployProduction',
//   'deployReleaseCandidates',
//   'list',
//   'listLinks',
//   'removeNeededPatch',
//   'removeNeededPatches',
//   'removeNeededPatchesAfter',
//   'removeNeededPatchesBefore',
//   'removePatch',
//   'removePatchSHA',
//   'reset',
//   'updateDependencies'
// ];

module.exports = ( function() {

  class Maintenance {
    /**
     * @public
     * @constructor
     *
     * @param {Array.<Patch>} [patches]
     * @param {Array.<ModifiedBranch>} [modifiedBranches]
     */
    constructor( patches = [], modifiedBranches = [] ) {
      assert( Array.isArray( patches ) );
      patches.forEach( patch => assert( patch instanceof Patch ) );
      assert( Array.isArray( modifiedBranches ) );
      modifiedBranches.forEach( branch => assert( branch instanceof ModifiedBranch ) );

      // @public {Array.<Patch>}
      this.patches = patches;

      // @public {Array.<ModifiedBranch>}
      this.modifiedBranches = modifiedBranches;
    }

    /**
     * Resets ALL of the maintenance state to a default "blank" state.
     * @public
     *
     * CAUTION: This will remove any information about any ongoing/complete maintenance release from your
     * .maintenance.json. Generally this should be done before any new maintenance release.
     */
    static reset() {
      new Maintenance().save();
    }

    /**
     * Runs a number of checks through every release branch.
     * @public
     *
     * @returns {Promise}
     */
    static async checkBranchStatus() {
      for ( const repo of getActiveRepos() ) {
        if ( !( await gitIsClean( repo ) ) ) {
          console.log( `Unclean repository: ${repo}, please resolve this and then run checkBranchStatus again` );
          return;
        }
      }

      const releaseBranches = await ReleaseBranch.getMaintenanceBranches();

      for ( const releaseBranch of releaseBranches ) {
        console.log( `Checking ${releaseBranch.repo} ${releaseBranch.branch}` );
        for ( const line of await releaseBranch.getStatus() ) {
          console.log( line );
        }
      }
    }

    /**
     * Builds all release branches (so that the state of things can be checked). Puts in in perennial/build.
     * @public
     */
    static async buildAll() {
      const releaseBranches = await ReleaseBranch.getMaintenanceBranches();

      const failed = [];

      for ( const releaseBranch of releaseBranches ) {
        console.log( `building ${releaseBranch.repo} ${releaseBranch.branch}` );
        try {
          await checkoutTarget( releaseBranch.repo, releaseBranch.branch, true ); // include npm update
          await build( releaseBranch.repo, {
            brands: releaseBranch.brands
          } );
          throw new Error( 'UNIMPLEMENTED, copy over' );
        }
        catch( e ) {
          failed.push( `${releaseBranch.repo} ${releaseBranch.brand}` );
        }
      }

      if ( failed.length ) {
        console.log( `Failed builds:\n${failed.join( '\n' )}` );
      }
      else {
        console.log( 'Builds complete' );
      }
    }

    /**
     * Displays a listing of the current maintenance status.
     * @public
     *
     * @returns {Promise}
     */
    static async list() {
      const maintenance = Maintenance.load();

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        console.log( `${modifiedBranch.repo} ${modifiedBranch.branch} ${modifiedBranch.brands.join( ',' )}${modifiedBranch.releaseBranch.isReleased ? '' : ' (unreleased)'}` );
        if ( modifiedBranch.deployedVersion ) {
          console.log( `  deployed: ${modifiedBranch.deployedVersion.toString()}` );
        }
        if ( modifiedBranch.neededPatches.length ) {
          console.log( `  needs: ${modifiedBranch.neededPatches.map( patch => patch.name ).join( ',' )}` );
        }
        if ( modifiedBranch.pushedMessages.length ) {
          console.log( `  pushedMessages: ${modifiedBranch.pushedMessages.join( ' and ' )}` );
        }
        if ( modifiedBranch.pendingMessages.length ) {
          console.log( `  pendingMessages: ${modifiedBranch.pendingMessages.join( ' and ' )}` );
        }
        if ( Object.keys( modifiedBranch.changedDependencies ).length > 0 ) {
          console.log( '  deps:' );
          for ( const key of Object.keys( modifiedBranch.changedDependencies ) ) {
            console.log( `    ${key}: ${modifiedBranch.changedDependencies[ key ]}` );
          }
        }
      }

      for ( const patch of maintenance.patches ) {
        console.log( `[${patch.name}]${patch.name !== patch.repo ? ` (${patch.repo})` : ''} ${patch.message}` );
        for ( const sha of patch.shas ) {
          console.log( `  ${sha}` );
        }
        for ( const modifiedBranch of maintenance.modifiedBranches ) {
          if ( modifiedBranch.neededPatches.includes( patch ) ) {
            console.log( `    ${modifiedBranch.repo} ${modifiedBranch.branch} ${modifiedBranch.brands.join( ',' )}` );
          }
        }
      }
    }

    /**
     * Shows any required testing links for the simulations.
     * @public
     *
     * @param {boolean} [includePatches]
     */
    static async listLinks( includePatches = false ) {
      const maintenance = Maintenance.load();

      const deployedBranches = maintenance.modifiedBranches.filter( modifiedBranch => !!modifiedBranch.deployedVersion );
      const productionBranches = deployedBranches.filter( modifiedBranch => modifiedBranch.deployedVersion.testType === null );
      const releaseCandidateBranches = deployedBranches.filter( modifiedBranch => modifiedBranch.deployedVersion.testType === 'rc' );

      if ( productionBranches.length ) {
        console.log( '\nProduction links\n' );

        for ( const modifiedBranch of productionBranches ) {
          const links = await modifiedBranch.getDeployedLinkLines();
          for ( const link of links ) {
            console.log( link );
          }
        }
      }

      if ( releaseCandidateBranches.length ) {
        console.log( '\nRelease Candidate links\n' );

        for ( const modifiedBranch of releaseCandidateBranches ) {
          const links = await modifiedBranch.getDeployedLinkLines();
          for ( const link of links ) {
            console.log( link );
          }
        }
      }
    }

    /**
     * Creates an issue to note patches on all unreleased branches that include a pushed message.
     * @public
     *
     * @param {string} [additionalNotes]
     */
    static async createUnreleasedIssues( additionalNotes = '' ) {
      const maintenance = Maintenance.load();

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        if ( !modifiedBranch.releaseBranch.isReleased && modifiedBranch.pushedMessages.length > 0 ) {
          console.log( `Creating issue for ${modifiedBranch.releaseBranch.toString()}` );
          await modifiedBranch.createUnreleasedIssue( additionalNotes );
        }
      }

      console.log( 'Finished creating unreleased issues' );
    }

    /**
     * Creates a patch
     * @public
     *
     * @param {string} repo
     * @param {string} message
     * @param {string} [patchName] - If no name is provided, the repo string will be used.
     * @returns {Promise}
     */
    static async createPatch( repo, message, patchName ) {
      const maintenance = Maintenance.load();

      patchName = patchName || repo;

      for ( const patch of maintenance.patches ) {
        if ( patch.name === patchName ) {
          throw new Error( 'Multiple patches with the same name are not concurrently supported' );
        }
      }

      maintenance.patches.push( new Patch( repo, patchName, message ) );

      maintenance.save();

      console.log( `Created patch for ${repo} with message: ${message}` );
    }

    /**
     * Removes a patch
     * @public
     *
     * @param {string} patchName
     * @returns {Promise}
     */
    static async removePatch( patchName ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      for ( const branch of maintenance.modifiedBranches ) {
        if ( branch.neededPatches.includes( patch ) ) {
          throw new Error( 'Patch is marked as needed by at least one branch' );
        }
      }

      maintenance.patches.splice( maintenance.patches.indexOf( patch ), 1 );

      maintenance.save();

      console.log( `Removed patch for ${patchName}` );
    }

    /**
     * Adds a particular SHA (to cherry-pick) to a patch.
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     * @returns {Promise}
     */
    static async addPatchSHA( patchName, sha ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      patch.shas.push( sha );

      maintenance.save();

      console.log( `Added SHA ${sha} to patch ${patchName}` );
    }

    /**
     * Removes a particular SHA (to cherry-pick) from a patch.
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     * @returns {Promise}
     */
    static async removePatchSHA( patchName, sha ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      const index = patch.shas.indexOf( sha );
      assert( index >= 0, 'SHA not found' );

      patch.shas.splice( index, 1 );

      maintenance.save();

      console.log( `Removed SHA ${sha} from patch ${patchName}` );
    }

    /**
     * Adds a needed patch to a given modified branch.
     * @public
     *
     * @param {string} repo
     * @param {string} branch
     * @param {string} patchName
     */
    static async addNeededPatch( repo, branch, patchName ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      const modifiedBranch = await maintenance.ensureModifiedBranch( repo, branch );
      modifiedBranch.neededPatches.push( patch );

      maintenance.save();

      console.log( `Added patch ${patchName} as needed for ${repo} ${branch}` );
    }

    /**
     * Adds a needed patch to a given release branch
     * @public
     *
     * @param {ReleaseBranch} releaseBranch
     * @param {string} patchName
     */
    static async addNeededPatchReleaseBranch( releaseBranch, patchName ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      const modifiedBranch = new ModifiedBranch( releaseBranch );
      maintenance.modifiedBranches.push( modifiedBranch );
      modifiedBranch.neededPatches.push( patch );
      maintenance.save();

      console.log( `Added patch ${patchName} as needed for ${releaseBranch.repo} ${releaseBranch.branch}` );
    }

    /**
     * Adds a needed patch to whatever subset of release branches match the filter.
     * @public
     *
     * @param {string} patchName
     * @param {function(ReleaseBranch):Promise.<boolean>} filter
     */
    static async addNeededPatches( patchName, filter ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );
      const releaseBranches = await ReleaseBranch.getMaintenanceBranches();

      for ( const releaseBranch of releaseBranches ) {
        const needsPatch = await filter( releaseBranch );

        if ( !needsPatch ) {
          console.log( `  skipping ${releaseBranch.repo} ${releaseBranch.branch}` );
          continue;
        }

        const modifiedBranch = await maintenance.ensureModifiedBranch( releaseBranch.repo, releaseBranch.branch, false, releaseBranches );
        if ( !modifiedBranch.neededPatches.includes( patch ) ) {
          modifiedBranch.neededPatches.push( patch );
          console.log( `Added needed patch ${patchName} to ${releaseBranch.repo} ${releaseBranch.branch}` );
          maintenance.save(); // save here in case a future failure would "revert" things
        }
        else {
          console.log( `Patch ${patchName} already included in ${releaseBranch.repo} ${releaseBranch.branch}` );
        }
      }

      maintenance.save();
    }

    /**
     * Adds a needed patch to all release branches.
     * @public
     *
     * @param {string} patchName
     */
    static async addAllNeededPatches( patchName ) {
      await Maintenance.addNeededPatches( patchName, async () => true );
    }

    /**
     * Adds a needed patch to all release branches that do NOT include the given commit on the repo
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     */
    static async addNeededPatchesBefore( patchName, sha ) {
      const maintenance = Maintenance.load();
      const patch = maintenance.findPatch( patchName );

      await Maintenance.addNeededPatches( patchName, async releaseBranch => {
        return await releaseBranch.isMissingSHA( patch.repo, sha );
      } );
    }

    /**
     * Adds a needed patch to all release branches that DO include the given commit on the repo
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     */
    static async addNeededPatchesAfter( patchName, sha ) {
      const maintenance = Maintenance.load();
      const patch = maintenance.findPatch( patchName );

      await Maintenance.addNeededPatches( patchName, async releaseBranch => {
        return await releaseBranch.includesSHA( patch.repo, sha );
      } );
    }

    /**
     * Adds a needed patch to all release branches that satisfy the given filter( releaseBranch, builtFileString )
     * where it builds the simulation with the defaults (brand=phet) and provides it as a string.
     * @public
     *
     * @param {string} patchName
     * @param {function(ReleaseBranch, builtFile:string): Promise.<boolean>} filter
     */
    static async addNeededPatchesBuildFilter( patchName, filter ) {
      await Maintenance.addNeededPatches( patchName, async releaseBranch => {
        await checkoutTarget( releaseBranch.repo, releaseBranch.branch, true );
        await gitPull( releaseBranch.repo );
        await build( releaseBranch.repo );
        const chipperVersion = ChipperVersion.getFromRepository();
        let filename;
        if ( chipperVersion.major !== 0 ) {
          filename = `../${releaseBranch.repo}/build/phet/${releaseBranch.repo}_en_phet.html`;
        }
        else {
          filename = `../${releaseBranch.repo}/build/${releaseBranch.repo}_en.html`;
        }
        return await filter( releaseBranch, fs.readFileSync( filename, 'utf8' ) );
      } );
    }

    /**
     * Removes a needed patch from a given modified branch.
     * @public
     *
     * @param {string} repo
     * @param {string} branch
     * @param {string} patchName
     */
    static async removeNeededPatch( repo, branch, patchName ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      const modifiedBranch = await maintenance.ensureModifiedBranch( repo, branch );
      const index = modifiedBranch.neededPatches.indexOf( patch );
      assert( index >= 0, 'Could not find needed patch on the modified branch' );

      modifiedBranch.neededPatches.splice( index, 1 );
      maintenance.tryRemovingModifiedBranch( modifiedBranch );

      maintenance.save();

      console.log( `Removed patch ${patchName} from ${repo} ${branch}` );
    }

    /**
     * Removes a needed patch from whatever subset of (current) release branches match the filter.
     * @public
     *
     * @param {string} patchName
     * @param {function(ReleaseBranch): Promise.<boolean>} filter
     */
    static async removeNeededPatches( patchName, filter ) {
      const maintenance = Maintenance.load();

      const patch = maintenance.findPatch( patchName );

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        const needsRemoval = await filter( modifiedBranch.releaseBranch );

        if ( !needsRemoval ) {
          console.log( `  skipping ${modifiedBranch.repo} ${modifiedBranch.branch}` );
          continue;
        }

        // Check if there's actually something to remove
        const index = modifiedBranch.neededPatches.indexOf( patch );
        if ( index < 0 ) {
          continue;
        }

        modifiedBranch.neededPatches.splice( index, 1 );
        maintenance.tryRemovingModifiedBranch( modifiedBranch );

        console.log( `Removed needed patch ${patchName} from ${modifiedBranch.repo} ${modifiedBranch.branch}` );
      }

      maintenance.save();
    }

    /**
     * Removes a needed patch from all release branches that do NOT include the given commit on the repo
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     */
    static async removeNeededPatchesBefore( patchName, sha ) {
      const maintenance = Maintenance.load();
      const patch = maintenance.findPatch( patchName );

      await Maintenance.removeNeededPatches( patchName, async releaseBranch => {
        return await releaseBranch.isMissingSHA( patch.repo, sha );
      } );
    }

    /**
     * Removes a needed patch from all release branches that DO include the given commit on the repo
     * @public
     *
     * @param {string} patchName
     * @param {string} sha
     */
    static async removeNeededPatchesAfter( patchName, sha ) {
      const maintenance = Maintenance.load();
      const patch = maintenance.findPatch( patchName );

      await Maintenance.removeNeededPatches( patchName, async releaseBranch => {
        return await releaseBranch.includesSHA( patch.repo, sha );
      } );
    }

    /**
     * Checks out a specific branch (using local commit data as necessary).
     * @public
     *
     * @param {string} repo
     * @param {string} branch
     */
    static async checkoutBranch( repo, branch ) {
      const maintenance = Maintenance.load();

      const modifiedBranch = await maintenance.ensureModifiedBranch( repo, branch, true );
      await modifiedBranch.checkout();

      // No need to save, shouldn't be changing things
      console.log( `Checked out ${repo} ${branch}` );
    }

    /**
     * Attempts to apply patches to the modified branches that are marked as needed.
     * @public
     */
    static async applyPatches() {
      const maintenance = Maintenance.load();
      let numApplied = 0;

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        if ( modifiedBranch.neededPatches.length === 0 ) {
          continue;
        }

        const repo = modifiedBranch.repo;
        const branch = modifiedBranch.branch;

        // Defensive copy, since we modify it during iteration
        for ( const patch of modifiedBranch.neededPatches.slice() ) {
          if ( patch.shas.length === 0 ) {
            continue;
          }

          const patchRepo = patch.repo;

          try {
            // Checkout whatever the latest patched SHA is (if we've patched it)
            if ( modifiedBranch.changedDependencies[ patchRepo ] ) {
              await gitCheckout( patchRepo, modifiedBranch.changedDependencies[ patchRepo ] );
            }
            else {
              // Look up the SHA to check out
              await gitCheckout( repo, branch );
              const dependencies = await getDependencies( repo );
              const sha = dependencies[ patchRepo ].sha;
              await gitCheckout( repo, 'master' );

              // Then check it out
              await gitCheckout( patchRepo, sha );
            }

            console.log( `Checked out ${patchRepo} SHA for ${repo} ${branch}` );

            for ( const sha of patch.shas ) {
              const cherryPickSuccess = await gitCherryPick( patchRepo, sha );

              if ( cherryPickSuccess ) {
                const currentSHA = await gitRevParse( patchRepo, 'HEAD' );
                console.log( `Cherry-pick success for ${sha}, result is ${currentSHA}` );

                modifiedBranch.changedDependencies[ patchRepo ] = currentSHA;
                modifiedBranch.neededPatches.splice( modifiedBranch.neededPatches.indexOf( patch ), 1 );
                numApplied++;

                // Don't include duplicate messages, since multiple patches might be for a single issue
                if ( !modifiedBranch.pendingMessages.includes( patch.message ) ) {
                  modifiedBranch.pendingMessages.push( patch.message );
                }

                break;
              }
              else {
                console.log( `Could not cherry-pick ${sha}` );
              }
            }
          }
          catch( e ) {
            maintenance.save();

            throw new Error( `Failure applying patch ${patchRepo} to ${repo} ${branch}: ${e}` );
          }
        }

        await gitCheckout( modifiedBranch.repo, 'master' );
      }

      maintenance.save();

      console.log( `${numApplied} patches applied` );
    }

    /**
     * Pushes local changes up to GitHub.
     * @public
     */
    static async updateDependencies() {
      const maintenance = Maintenance.load();

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        const changedRepos = Object.keys( modifiedBranch.changedDependencies );
        if ( changedRepos.length === 0 ) {
          continue;
        }

        try {
          await checkoutTarget( modifiedBranch.repo, modifiedBranch.branch, true ); // npm update, since we'll build.
          console.log( `Checked out ${modifiedBranch.repo} ${modifiedBranch.branch}` );

          for ( const dependency of changedRepos ) {
            const dependencyBranch = modifiedBranch.dependencyBranch;
            const branches = await getBranches( dependency );
            const sha = modifiedBranch.changedDependencies[ dependency ];

            if ( branches.includes( dependencyBranch ) ) {
              console.log( `Branch ${dependencyBranch} already exists in ${dependency}` );
              await gitCheckout( dependency, dependencyBranch );
              await gitPull( dependency );
              const currentSHA = await gitRevParse( dependency, 'HEAD' );

              if ( sha !== currentSHA ) {
                console.log( `Attempting to (hopefully fast-forward) merge ${sha}` );
                await execute( 'git', [ 'merge', sha ], `../${dependency}` );
                await gitPush( dependency, dependencyBranch );
              }
            }
            else {
              console.log( `Branch ${dependencyBranch} does not exist in ${dependency}, creating.` );
              await gitCheckout( dependency, sha );
              await gitCreateBranch( dependency, dependencyBranch );
              await gitPush( dependency, dependencyBranch );
            }

            delete modifiedBranch.changedDependencies[ dependency ];
            modifiedBranch.deployedVersion = null;
            maintenance.save(); // save here in case a future failure would "revert" things
          }

          if ( changedRepos.includes( 'chipper' ) ) {
            await npmUpdate( 'chipper' );
          }

          console.log( await build( modifiedBranch.repo, {
            brands: modifiedBranch.brands
          } ) );

          const message = modifiedBranch.pendingMessages.join( ' and ' );
          await updateDependenciesJSON( modifiedBranch.repo, modifiedBranch.brands, message, modifiedBranch.branch );

          // Move messages from pending to pushed
          for ( const message of modifiedBranch.pendingMessages ) {
            if ( !modifiedBranch.pushedMessages.includes( message ) ) {
              modifiedBranch.pushedMessages.push( message );
            }
          }
          modifiedBranch.pendingMessages = [];
          maintenance.save(); // save here in case a future failure would "revert" things

          await checkoutMaster( modifiedBranch.repo, true ); // npm update back, so we don't leave the sim in a weird state
        }
        catch( e ) {
          maintenance.save();

          throw new Error( `Failure updating dependencies for ${modifiedBranch.repo} to ${modifiedBranch.branch}: ${e}` );
        }
      }

      maintenance.save();

      console.log( 'Dependencies updated' );
    }

    /**
     * Deploys RC versions of the modified branches that need it.
     * @public
     */
    static async deployReleaseCandidates() {
      const maintenance = Maintenance.load();

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        if ( !modifiedBranch.isReadyForReleaseCandidate || !modifiedBranch.releaseBranch.isReleased ) {
          continue;
        }

        try {
          console.log( `Running RC deploy for ${modifiedBranch.repo} ${modifiedBranch.branch}` );

          const version = await rc( modifiedBranch.repo, modifiedBranch.branch, modifiedBranch.brands, true, modifiedBranch.pushedMessages.join( ', ' ) );
          modifiedBranch.deployedVersion = version;
          maintenance.save(); // save here in case a future failure would "revert" things
        }
        catch( e ) {
          maintenance.save();

          throw new Error( `Failure with RC deploy for ${modifiedBranch.repo} to ${modifiedBranch.branch}: ${e}` );
        }
      }

      maintenance.save();

      console.log( 'RC versions deployed' );
    }

    /**
     * Deploys production versions of the modified branches that need it.
     * @public
     */
    static async deployProduction() {
      const maintenance = Maintenance.load();

      for ( const modifiedBranch of maintenance.modifiedBranches ) {
        if ( !modifiedBranch.isReadyForProduction || !modifiedBranch.releaseBranch.isReleased ) {
          continue;
        }

        try {
          console.log( `Running production deploy for ${modifiedBranch.repo} ${modifiedBranch.branch}` );

          const version = await production( modifiedBranch.repo, modifiedBranch.branch, modifiedBranch.brands, true, modifiedBranch.pushedMessages.join( ', ' ) );
          modifiedBranch.deployedVersion = version;
          modifiedBranch.pushedMessages = [];
          maintenance.save(); // save here in case a future failure would "revert" things
        }
        catch( e ) {
          maintenance.save();

          throw new Error( `Failure with production deploy for ${modifiedBranch.repo} to ${modifiedBranch.branch}: ${e}` );
        }
      }

      maintenance.save();

      console.log( 'production versions deployed' );
    }

    /**
     * Convert into a plain JS object meant for JSON serialization.
     * @public
     *
     * @returns {{patches:Array.<Object>, modifiedBranches:Array.<Object>}} - see Patch.serialize() and ModifiedBranch.serialize()
     */
    serialize() {
      return {
        patches: this.patches.map( patch => patch.serialize() ),
        modifiedBranches: this.modifiedBranches.map( modifiedBranch => modifiedBranch.serialize() )
      };
    }

    /**
     * Takes a serialized form of the Maintenance and returns an actual instance.
     * @public
     *
     * @param {{patches:Array.<Object>, modifiedBranches:Array.<Object>}} - see Maintenance.serialize()
     * @returns {Maintenance}
     */
    static deserialize( { patches, modifiedBranches } ) {
      // Pass in patch references to branch deserialization
      const deserializedPatches = patches.map( Patch.deserialize );
      modifiedBranches = modifiedBranches.map( modifiedBranch => ModifiedBranch.deserialize( modifiedBranch, deserializedPatches ) );
      modifiedBranches.sort( ( a, b ) => {
        if ( a.repo !== b.repo ) {
          return a.repo < b.repo ? -1 : 1;
        }
        if ( a.branch !== b.branch ) {
          return a.branch < b.branch ? -1 : 1;
        }
        return 0;
      } );
      return new Maintenance( deserializedPatches, modifiedBranches );
    }

    /**
     * Saves the state of this object into the maintenance file.
     * @public
     */
    save() {
      return fs.writeFileSync( MAINTENANCE_FILE, JSON.stringify( this.serialize(), null, 2 ) );
    }

    /**
     * Loads a new Maintenance object (if possible) from the maintenance file.
     * @public
     *
     * @returns {Maintenance}
     */
    static load() {
      if ( fs.existsSync( MAINTENANCE_FILE ) ) {
        return Maintenance.deserialize( JSON.parse( fs.readFileSync( MAINTENANCE_FILE, 'utf8' ) ) );
      }
      else {
        return new Maintenance();
      }
    }

    /**
     * Starts a command-line REPL with features loaded.
     * @public
     *
     * @returns {Promise}
     */
    static startREPL() {
      return new Promise( ( resolve, reject ) => {
        winston.default.transports.console.level = 'error';

        const session = repl.start( {
          prompt: 'maintenance> ',
          useColors: true,
          replMode: repl.REPL_MODE_STRICT,
          ignoreUndefined: true
        } );

        // Wait for promises before being ready for input
        const nodeEval = session.eval;
        session.eval = async ( cmd, context, filename, callback ) => {
          nodeEval( cmd, context, filename, ( _, result ) => {
            if ( result instanceof Promise ) {
              result.then( val => callback( _, val ) ).catch( e => {
                if ( e.stack ) {
                  console.error( `Maintenance task failed:\n${e.stack}\nFull Error details:\n${JSON.stringify( e, null, 2 )}` );
                }
                else if ( typeof e === 'string' ) {
                  console.error( `Maintenance task failed: ${e}` );
                }
                else {
                  console.error( `Maintenance task failed with unknown error: ${JSON.stringify( e, null, 2 )}` );
                }
              } );
            }
            else {
              callback( _, result );
            }
          } );
        };

        // Only autocomplete "public" api functions for Maintenance.
        // const nodeCompleter = session.completer;
        // session.completer = function( text, cb ) {
        //   nodeCompleter( text, ( _, [ completions, completed ] ) => {
        //     const match = completed.match( /^Maintenance\.(\w*)+/ );
        //     if ( match ) {
        //       const funcStart = match[ 1 ];
        //       cb( null, [ PUBLIC_FUNCTIONS.filter( f => f.startsWith( funcStart ) ).map( f => `Maintenance.${f}` ), completed ] );
        //     }
        //     else {
        //       cb( null, [ completions, completed ] );
        //     }
        //   } );
        // };

        // Allow controlling verbosity
        Object.defineProperty( global, 'verbose', {
          get() {
            return winston.default.transports.console.level === 'info';
          },
          set( value ) {
            winston.default.transports.console.level = value ? 'info' : 'error';
          }
        } );

        session.context.Maintenance = Maintenance;
        session.context.ReleaseBranch = ReleaseBranch;

        session.on( 'exit', resolve );
      } );
    }

    /**
     * Looks up a patch by its name.
     * @public
     *
     * @param {string} patchName
     * @returns {Patch}
     */
    findPatch( patchName ) {
      const patch = this.patches.find( p => p.name === patchName );
      assert( patch, `Patch not found for ${patchName}` );

      return patch;
    }

    /**
     * Looks up (or adds) a ModifiedBranch by its identifying information.
     * @private
     *
     * @param {string} repo
     * @param {string} branch
     * @param {boolean} [errorIfMissing]
     * @param {Array.<ReleaseBranch>} [releaseBranches] - If provided, it will speed up the process
     * @returns {Promise.<ModifiedBranch>}
     */
    async ensureModifiedBranch( repo, branch, errorIfMissing = false, releaseBranches = null ) {
      let modifiedBranch = this.modifiedBranches.find( modifiedBranch => modifiedBranch.repo === repo && modifiedBranch.branch === branch );

      if ( !modifiedBranch ) {
        if ( errorIfMissing ) {
          throw new Error( `Could not find a tracked modified branch for ${repo} ${branch}` );
        }
        releaseBranches = releaseBranches || await ReleaseBranch.getMaintenanceBranches( testRepo => testRepo === repo );
        const releaseBranch = releaseBranches.find( release => release.repo === repo && release.branch === branch );
        assert( releaseBranch, `Could not find a release branch for repo=${repo} branch=${branch}` );

        modifiedBranch = new ModifiedBranch( releaseBranch );

        // If we are creating it, add it to our list.
        this.modifiedBranches.push( modifiedBranch );
      }

      return modifiedBranch;
    }

    /**
     * Attempts to remove a modified branch (if it doesn't need to be kept around).
     * @public
     *
     * @param {ModifiedBranch} modifiedBranch
     */
    tryRemovingModifiedBranch( modifiedBranch ) {
      if ( modifiedBranch.isUnused ) {
        const index = this.modifiedBranches.indexOf( modifiedBranch );
        assert( index >= 0 );

        this.modifiedBranches.splice( index, 1 );
      }
    }
  }

  return Maintenance;
} )();
