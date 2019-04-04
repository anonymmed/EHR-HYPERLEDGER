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

import { AssetRegistry } from "composer-client";

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



/**
 * PharmacyAddDrug transaction
 * @param {model.PharmacyAddDrug} PharmacyAddDrug
 * @transaction
 * @author Mohamed Abdelhafidh
 */

async function PharmacyAddDrug(tx) {    
    /**
     * Getting the Factory for creating new events and resources
     */
    let factory = getFactory();
    /**
     * Getting the Patient Registry to update the model later
     */
        return getParticipantRegistry('model.Patient').then((patientRegistry) => {
            /**
             * Pushing the new drug into the patient's pharmacy drug collection
             */
         tx.patient.pharmacyDrugs.push(tx.drug);
         /**
          * Updating the patient with the new details
          */
            patientRegistry.update(tx.patient);
        }).then(() => {
        return getAssetRegistry('model.Pharmacy').then(pharmacyRegistry => {
            return pharmacyRegistry.get(tx.pharmacy.pharmacyId).then(pharmacyAsset => {
           /**
                 * Firing the event of completion
                 */
                let event = factory.newEvent('model', 'PharmacyAddDrugFinished');
                event.details = 'The Drug ' + tx.drug.name +' has been added successfully to ' +
                 tx.patient.firstName + ' ' + tx.patient.lastName + '\'smedical record from pharmacy : ' + pharmacyAsset.name ;
                emit(event);
                });
                })
            })
}

/**
 * PharmacyAddDrug transaction
 * @param {model.PharmacyAddDrugFromPrescription} PharmacyAddDrugFromPrescription
 * @transaction
 * @author Mohamed Abdelhafidh
 */
async function PharmacyAddDrugFromPrescription(tx) {
    /**
     * Getting the Factory, Asset and Participant Registries
     */
    let factory = getFactory();

    return getAssetRegistry('model.Prescription').then((prescriptionRegistry) => {
        return prescriptionRegistry.get(tx.prescriptionId);

    }).then((prescription) => {
        return getParticipantRegistry('model.Patient').then((patientRegistry) => {            
            return getAssetRegistry('model.Drug').then((drugRegistry) => {
                for (d of prescription.drugs) {
                    return drugRegistry.get(d.$identifier).then(returnedDrug => {
                        console.log(returnedDrug);
                        tx.patient.pharmacyDrugs.push(returnedDrug);
                    });
                                    //let drug = factory.newResource('model', 'Drug', returnedDrug.)
                }    
            }).then(() => {
                patientRegistry.update(tx.patient);
            })
        }).then(() => {
            /**
             * Firing the event of completion
             */
            let event = factory.newEvent('model', 'PharmacyAddDrugFinished');
            event.details = 'The Drug  has been added successfully to ' + tx.patient.firstName + ' ' + tx.patient.lastName + '\'smedical record';
            emit(event);
    
        })
    })

}

/**
 * PharmacyAddDrug transaction
 * @param {model.addDrugToPrescription} addDrugToPrescription
 * @transaction
 * @author Mohamed Abdelhafidh
 */
async function addDrugToPrescription(tx) {

    return getAssetRegistry('model.Drug').then((drugRegistry) => {
        var factory = getFactory();
        var drug = factory.newResource('model', 'Drug', tx.drug.drugId);
        drug.name = tx.drug.name;
        drug.manufacturer = tx.drug.manufacturer;
        drug.price = tx.drug.price;
        drug.lotNumber = tx.drug.lotNumber;
        drugRegistry.add(drug);
    }).then(() => {
        return getAssetRegistry('model.Prescription').then((presRegistry) => {
            var factory = getFactory();
            var drugRelation = factory.newRelationship('model', 'Drug', 'tx.drug.drugId');
            tx.prescription.drugs.push(drugRelation);
            presRegistry.update(tx.prescription);
    
        });
    })
    
}

 
