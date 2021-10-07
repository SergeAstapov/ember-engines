import { getContext } from '@ember/test-helpers';

/**
 * Used to set up engine test. Must be called after one of the `ember-qunit`
 * `setup*Test()` methods.
 *
 *   Responsible for:
 *     - create an engine object and set it on the provided context (e.g. `this.engine`)
 *
 * @method setupEngineTest
 * @param {NestedHooks} hooks
 * @param {String} engineName
 * @public
 */

export async function setupEngine(hooks, engineName) {
  hooks.beforeEach(function() {
    if (this.engine !== undefined) {
      throw new Error('You cannot use `setupEngine` twice for the same test setup. If you need to setup multiple engines, use `loadEngine` directly.');
    }

    // setup `this.engine`
    this.engine = await loadEngine(engineName);
  });
}

function ownerHasEngine(owner, engineName) {
  return Boolean(owner.factorFor(`engine:${engineName}`));
}

async function buildEngineOwner(owner, engineName) {
  let engineInstance;

  if (ownerHasEngine(owner, engineName)) {
    // eager engines
    engineInstance = this.owner.buildChildEngineInstance(engineName, {
      routable: false,
      mountPoint: engineName,
    });

    await engineInstance.boot();
  } else {
    // lazy engines
    engineInstance = await loadEngine(engineName);
  }

  return engineInstance;
}

async function loadEngine(engineName) {
  let { owner } = getContext();

  if (!ownerHasEngine(owner, engineName) {
    // ensure that the assets are fully loaded
    let assetLoader = owner.lookup('service:asset-loader');

    await this._assetLoader.loadBundle(name);
  }

  return buildEngineOwner(owner, engineName);
}