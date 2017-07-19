(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGLIMaccountController: function (scope, routeParams, resourceFactory, location, route, http, $modal, dateFilter, API_VERSION, $sce, $rootScope) {




            var loanAccountNumber=routeParams.id;
            scope.loanAccountId=routeParams.id;
            scope.groupGLIMAccounts={};
            scope.productName="";
            scope.buttons={};



            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "addloancharge":
                        location.path('/addloancharge/' + accountId);
                        break;
                    case "addcollateral":
                        location.path('/addcollateral/' + accountId);
                        break;
                    case "assignloanofficer":
                        location.path('/assignloanofficer/' + accountId);
                        break;
                    case "modifyapplication":
                        location.path('/editloanaccount/' + accountId);
                        break;
                    case "approve":
                        location.path('/glimloanaccount/' + routeParams.id + '/glimApprove/'+accountId);   //accountid is glimId and  routerparamsid is child loanid
                        break;
                    case "reject":
                        location.path('/loanaccount/' + accountId + '/reject');
                        break;
                    case "withdrawnbyclient":
                        location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.LoanAccountResource.delete({loanId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/loanaccount/' + accountId + '/undoapproval');
                        break;
                    case "disburse":
                        location.path('/glimloanaccount/' + routeParams.id + '/glimDisburse/'+accountId);
                        break;
                    case "disbursetosavings":
                        location.path('/loanaccount/' + accountId + '/disbursetosavings');
                        break;
                    case "undodisbursal":
                        location.path('/loanaccount/' + accountId + '/undodisbursal');
                        break;
                    case "makerepayment":
                        location.path('/loanaccount/' + accountId + '/repayment');
                        break;
                    case "prepayment":
                        location.path('/loanaccount/' + accountId + '/prepayloan');
                        break;
                    case "waiveinterest":
                        location.path('/loanaccount/' + accountId + '/waiveinterest');
                        break;
                    case "writeoff":
                        location.path('/loanaccount/' + accountId + '/writeoff');
                        break;
                    case "recoverypayment":
                        location.path('/loanaccount/' + accountId + '/recoverypayment');
                        break;
                    case "close-rescheduled":
                        location.path('/loanaccount/' + accountId + '/close-rescheduled');
                        break;
                    case "transferFunds":
                        if (scope.loandetails.clientId) {
                            location.path('/accounttransfers/fromloans/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/loanaccount/' + accountId + '/close');
                        break;
                    case "createguarantor":
                        location.path('/guarantor/' + accountId);
                        break;
                    case "listguarantor":
                        location.path('/listguarantors/' + accountId);
                        break;
                    case "recoverguarantee":
                        location.path('/loanaccount/' + accountId + '/recoverguarantee');
                        break;
                    case "unassignloanofficer":
                        location.path('/loanaccount/' + accountId + '/unassignloanofficer');
                        break;
                    case "loanscreenreport":
                        location.path('/loanscreenreport/' + accountId);
                        break;
                    case "reschedule":
                        location.path('/loans/' +accountId + '/reschedule');
                        break;
                    case "adjustrepaymentschedule":
                        location.path('/adjustrepaymentschedule/'+accountId) ;
                        break ;
                    case "foreclosure":
                        location.path('loanforeclosure/' + accountId);
                        break;
                }
            };



            resourceFactory.groupGLIMAccountResource.get({groupId: routeParams.groupId,loanNumber:loanAccountNumber }, function (data) {
                scope.groupGLIMAccounts = data[0];
             //   scope.loandetails.accountNumber=scope.groupGLIMAccounts.accountNumber;
              scope.productName=data[0].childGLIMAccounts[0].productName;

             // scope.loanStatus=data[0].loanStatus;

                if (scope.groupGLIMAccounts.loanStatus === "SUBMITTED_AND_PENDING_APPROVAL") {

                    scope.buttons = { singlebuttons: [

                        {
                            name: "button.approve",
                            icon: "icon-ok",
                            taskPermissionName: 'APPROVE_LOAN'
                        },
                        {
                            name: "button.modifyapplication",
                            icon: "icon-edit",
                            taskPermissionName: 'UPDATE_LOAN'
                        },
                        {
                            name: "button.reject",
                            icon: "icon-remove",
                            taskPermissionName: 'REJECT_LOAN'
                        }
                    ]

                    };

                }

                if (data[0].loanStatus === "APPROVED") {

                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.assignloanofficer",
                            icon: "icon-user",
                            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                        },
                        {
                            name: "button.disburse",
                            icon: "icon-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        }

                    ]


                    };
                }








            });





            resourceFactory.groupResource.get({groupId: routeParams.groupId, associations: 'all'}, function (data) {
                scope.group = data;
                /*   if(scope.group.clientMembers){
                 scope.isGroupMembersAvailable = (scope.group.clientMembers.length>0);
                 }
                 scope.isClosedGroup = scope.group.status.value == 'Closed';
                 scope.staffData.staffId = data.staffId;
                 if(data.collectionMeetingCalendar) {
                 scope.entityId = data.id;
                 scope.entityType = data.collectionMeetingCalendar.entityType.value;

                 if(scope.entityType == "GROUPS" && data.hierarchy == "."+ data.id + "." ){
                 scope.editMeeting = true;
                 }
                 }*/

            });











        }
    });
    mifosX.ng.application.controller('ViewGLIMaccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$modal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ViewGLIMaccountController]).run(function ($log) {
        $log.info("ViewGLIMaccountController initialized");
    });
}(mifosX.controllers || {}));