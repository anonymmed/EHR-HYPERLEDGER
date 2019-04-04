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
async function SampleTransaction(tx) {  // eslint-disable-line no-unused-vars
  	
    // Save the old value of the asset.
    // Get the asset registry for the asset.
	var factory = getFactory();
    var practitioner = factory.newRelationship('model', 'Practitioner', '2');
    tx.practitioner = practitioner;
	var msg = getAssetRegistry('model.Allergies')
      .then((allergieAssetRegistry) => {
    	var factory = getFactory();
      var allergy = factory.newResource('model', 'Allergies', 'allergy2');
      allergy.name = 'ward';
      allergy.treatmentBrief = 'simple desc';
      allergy.practitioner = tx.practitioner;
      allergieAssetRegistry.add(allergy);
    });
  console.log(msg);
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('model', 'SampleEvent');
    event.allergyName = "aaa";
    emit(event);

}

 
