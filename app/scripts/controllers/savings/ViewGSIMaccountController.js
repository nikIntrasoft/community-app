(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGSIMaccountController: function (scope, routeParams, route, location, resourceFactory, dateFilter, $modal) {

            scope.groupId=routeParams.groupId;
            scope.gsimAccountNumber=routeParams.gsimAccountNumber;
            scope.savingaccountdetails = [];
            var gsimChildAccountId=0;
            scope.staffData = {};
            scope.formData = {};
            scope.date = {};
            var parentGSIMId=0;


            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.savingaccountdetails.transactions){
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                }
            };

            resourceFactory.groupGSIMAccountResource.get({groupId: scope.groupId,parentGSIMAccountNo:scope.gsimAccountNumber}, function (data) {
                scope.groupAccounts = data[0];
              gsimChildAccountId=data[0].childGSIMAccounts[0].id;
                parentGSIMId=scope.groupAccounts.gsimId;

                resourceFactory.savingsResource.get({accountId: gsimChildAccountId, associations: 'all'}, function (data) {
                    scope.savingaccountdetails = data;
                    scope.convertDateArrayToObject('date');
                    if(scope.savingaccountdetails.groupId) {
                        resourceFactory.groupResource.get({groupId: scope.savingaccountdetails.groupId}, function (data) {
                            scope.groupLevel = data.groupLevel;
                        });
                    }
                    scope.showonhold = true;
                    if(angular.isUndefined(data.onHoldFunds)){
                        scope.showonhold = false;
                    }
                    scope.staffData.staffId = data.staffId;
                    scope.date.toDate = new Date();
                    scope.date.fromDate = new Date(data.timeline.activatedOnDate);

                    scope.status = data.status.value;
                    if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                        scope.choice = true;
                    }
                    scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
                    scope.chargePayAction = data.status.value == "Active" ? true : false;
                    if (scope.savingaccountdetails.charges) {
                        scope.charges = scope.savingaccountdetails.charges;
                        scope.chargeTableShow = true;
                    } else {
                        scope.chargeTableShow = false;
                    }
                    if (data.status.value == "Submitted and pending approval") {
                        scope.buttons = { singlebuttons: [
                            {
                                name: "button.modifyapplication",
                                icon: "icon-pencil ",
                                taskPermissionName:"UPDATE_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.approve",
                                icon: "icon-ok-sign",
                                taskPermissionName:"APPROVE_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.reject",
                                icon: "icon-remove-circle",
                                taskPermissionName:"REJECT_SAVINGSACCOUNT"
                            }
                        ],
                            options: [
                                {
                                    name: "button.reject",
                                    taskPermissionName:"REJECT_SAVINGSACCOUNT"
                                },
                                {
                                    name: "button.withdrawnbyclient",
                                    taskPermissionName:"WITHDRAW_SAVINGSACCOUNT"
                                },
                                {
                                    name: "button.addcharge",
                                    taskPermissionName:"CREATE_SAVINGSACCOUNTCHARGE"
                                },
                                {
                                    name: "button.delete",
                                    taskPermissionName:"DELETE_SAVINGSACCOUNT"
                                }
                            ]
                        };
                    }

                    if (data.status.value == "Approved") {
                        scope.buttons = { singlebuttons: [
                            {
                                name: "button.undoapproval",
                                icon: "icon-undo",
                                taskPermissionName:"APPROVALUNDO_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.activate",
                                icon: "icon-ok-sign",
                                taskPermissionName:"ACTIVATE_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.addcharge",
                                icon: "icon-plus",
                                taskPermissionName:"CREATE_SAVINGSACCOUNTCHARGE"
                            }
                        ]
                        };
                    }

                    if (data.status.value == "Active") {
                        scope.buttons = { singlebuttons: [
                            {
                                name: "button.postInterest",
                                icon: "icon-circle-arrow-right",
                                taskPermissionName:"POSTINTEREST_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.addcharge",
                                icon:"icon-circle-arrow-down",
                                taskPermissionName:"CREATE_SAVINGSACCOUNTCHARGE"
                            },
                            {
                                name: "button.close",
                                icon :"icon-ban-circle",
                                taskPermissionName:"CLOSE_SAVINGSACCOUNT"
                            }

                        ]

                        };
                        if (data.clientId) {
                            scope.buttons.options.push({
                                name: "button.transferFunds",
                                taskPermissionName:"CREATE_ACCOUNTTRANSFER"
                            });
                        }
                        if (data.charges) {
                            for (var i in scope.charges) {
                                if (scope.charges[i].name == "Annual fee - INR") {
                                    scope.buttons.options.push({
                                        name: "button.applyAnnualFees",
                                        taskPermissionName:"APPLYANNUALFEE_SAVINGSACCOUNT"
                                    });
                                    scope.annualChargeId = scope.charges[i].id;
                                }
                            }
                        }
                        if(data.taxGroup){
                            if(data.withHoldTax){
                                scope.buttons.options.push({
                                    name: "button.disableWithHoldTax",
                                    taskPermissionName:"UPDATEWITHHOLDTAX_SAVINGSACCOUNT"
                                });
                            }else{
                                scope.buttons.options.push({
                                    name: "button.enableWithHoldTax",
                                    taskPermissionName:"UPDATEWITHHOLDTAX_SAVINGSACCOUNT"
                                });
                            }
                        }
                    }
                    if (data.annualFee) {
                        var annualdueDate = [];
                        annualdueDate = data.annualFee.feeOnMonthDay;
                        annualdueDate.push(new Date().getFullYear());
                        scope.annualdueDate = new Date(annualdueDate);
                    };
                });

            });



            scope.routeToSaving = function (id) {
                location.path('/viewsavingaccount/' + id);
            };


            console.log("outer"+parentGSIMId);

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "modifyapplication":
                        location.path('/editgsimaccount/' + parentGSIMId+'/'+gsimChildAccountId);
                        break;
                    case "approve":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/approve');
                        break;
                    case "reject":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/reject');
                        break;
                    case "withdrawnbyclient":
                        location.path('/savingaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.savingsResource.delete({accountId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/undoapproval');
                        break;
                    case "activate":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/activate');
                        break;
                    case "deposit":
                        location.path('/savingaccount/' + accountId + '/deposit');
                        break;
                    case "withdraw":
                        location.path('/savingaccount/' + accountId + '/withdrawal');
                        break;
                    case "addcharge":
                        location.path('/savingaccounts/' + accountId + '/charges');
                        break;
                    case "calculateInterest":
                        resourceFactory.savingsResource.save({accountId: accountId, command: 'calculateInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    case "postInterest":
                        resourceFactory.savingsResource.save({accountId: accountId, command: 'postInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    case "applyAnnualFees":
                        location.path('/savingaccountcharge/' + accountId + '/applyAnnualFees/' + scope.annualChargeId);
                        break;
                    case "transferFunds":
                        if (scope.savingaccountdetails.clientId) {
                            location.path('/accounttransfers/fromsavings/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/savingaccount/' + accountId + '/close');
                        break;
                    case "assignSavingsOfficer":
                        location.path('/assignsavingsofficer/' + accountId);
                        break;
                    case "unAssignSavingsOfficer":
                        location.path('/unassignsavingsofficer/' + accountId);
                        break;
                    case "enableWithHoldTax":
                        var changes = {
                            withHoldTax:true
                        };
                        resourceFactory.savingsResource.update({accountId: accountId, command: 'updateWithHoldTax'}, changes, function (data) {
                            route.reload();
                        });
                        break;
                    case "disableWithHoldTax":
                        var changes = {
                            withHoldTax:false
                        };
                        resourceFactory.savingsResource.update({accountId: accountId, command: 'updateWithHoldTax'}, changes, function (data) {
                            route.reload();
                        });
                        break;
                    case "postInterestAsOn":
                        location.path('/savingaccount/' + accountId + '/postInterestAsOn');
                        break;

                }
            };




        }
    });
    mifosX.ng.application.controller('ViewGSIMaccountController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'dateFilter', '$modal', mifosX.controllers.ViewGSIMaccountController]).run(function ($log) {
        $log.info("ViewGSIMaccountController initialized");
    });
}(mifosX.controllers || {}));
