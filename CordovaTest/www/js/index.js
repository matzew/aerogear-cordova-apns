/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 // handle the incomming APNS notifications for iOS
 function onNotificationAPN(e) {
     // display the push notification message... (extract the APNs alert key value....)
     alert(e.alert);
 }

 var app = {
     // Application Constructor
     initialize: function() {
         this.bindEvents();
     },
     // Bind Event Listeners
     //
     // Bind any events that are required on startup. Common events are:
     // 'load', 'deviceready', 'offline', and 'online'.
     bindEvents: function() {
         document.addEventListener('deviceready', this.onDeviceReady, false);
     },
     // deviceready Event Handler
     //
     // The scope of 'this' is the event. In order to call the 'receivedEvent'
     // function, we must explicity call 'app.receivedEvent(...);'
     onDeviceReady: function() {
         // note that this is an event handler so the scope is that of the event
         // so we need to call app.report(), and not this.report()
         app.initAeroGearPush();

         app.receivedEvent('deviceready');
     },
     // Update DOM on a Received Event
     receivedEvent: function(id) {
         var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');

         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');

         console.log('Received Event: ' + id);
     },
     initAeroGearPush: function() {

         // get the push plugin object
         var pushNotification = window.plugins.pushNotification;
         // set callbacks for dealing with the DeviceToken, or an Error
         pushNotification.register(
             // set callback for dealing with the DeviceToken
             function(token) {
                 // create the unified push helper:
                 var client = AeroGear.UnifiedPushClient(
                      "variantID",
                      "variant secret",
                      "https://SERVER:PORT/CONTEXT/rest/registry/device"
                 );

                 // apply the metadata for the Apache Cordova client:
                 var metadata = {
                     deviceToken: token,
                     alias: "mwessendorf"
                 }

                 // register with the UP server:
                 client.registerWithPushServer(metadata);
             },
             // set callback when no deviceToken could be received (from APNs)
             function() {
                 console.log("Fail");
             },
             // Seeting options to allow badge,sound and alert APNs keys
             {
                 "badge":"true",
                 "sound":"true",
                 "alert":"true",
                 "ecb":"onNotificationAPN"
             }
         );
     },
 };
