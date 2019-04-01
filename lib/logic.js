/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {model.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;
    const oldValue1 = tx.pharmacist.firstName;
    // Update the asset with the new value.
    tx.asset.value = tx.newValue;
    tx.pharmacist.firstName = tx.newValue1;
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('model.SampleAsset');
    const pharmacistRegistry = await getAssetRegistry('model.Pharmacist');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);
    await assetRegistry.update(tx.pharmacist);
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('model', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}
