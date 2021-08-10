module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    //my function variables
    var theCallCost = 0;
    var theSmsCost = 0;
    var theWarningLevel = 0;
    var theCriticalLevel = 0;

    var callCostTotal = 0;
    var smsCostTotal = 0;

    let actionList = [];
    const moment = require('moment');
    moment().format()

    function resetButton() {
        actionList = [];
    }

    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;
    }

    function getSettings
        () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {
        if (!hasReachedCriticalLevel()) {

        let cost = 0;
            if (action === 'sms') {
                cost = smsCost;
            }
            else if (action === 'call') {
                cost = callCost;
            }

            actionList.push({
                type: action,
                cost,
                timestamp: new Date()
            });
        }
    }

    function actions() {
        return actionList;
    }

    function actionsFor(type) {
        const filteredActions = [];

        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                filteredActions.push(action);
            }
        }

        return filteredActions;
    }

    function getTotal(type) {
        let total = 0;

        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)
        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel() {
        const total = grandTotal();
        return total >= criticalLevel
    }

    //my functions

    function setCallCost(callCost) {
        theCallCost = callCost;
    }

    function getCallCost() {
        return theCallCost;
    }

    function setSmsCost(smsCost) {
        theSmsCost = smsCost;
    }

    function getSmsCost() {
        return theSmsCost;
    }

    function setWarningLevel(warningLevel) {
        theWarningLevel = warningLevel;
    }

    function getWarningLevel() {
        return theWarningLevel;
    }

    function setCriticalLevel(criticalLevel) {
        theCriticalLevel = criticalLevel;
    }

    function getCriticalLevel() {
        return theCriticalLevel;
    }

    function makeCall() {
        if (!hasReachedCriticalLevel()) {
            callCostTotal += theCallCost;
        }
    }

    function getTotalCost() {
        return callCostTotal + smsCostTotal;
    }

    function getTotalCallCost() {
        return callCostTotal;
    }

    function getTotalSmsCost() {
        return smsCostTotal;

    }

    function sendSms() {
        if (!hasReachedCriticalLevel()) {
            smsCostTotal += theSmsCost;
        }
    }

    // function hasReachedCriticalLevel() {
    //     return getTotalCost() >= getCriticalLevel();
    // }

    function totalClassName() {
        if (getTotalCost() >= getCriticalLevel()) {
            return "critical"
        }

        if (getTotalCost() >= getWarningLevel()) {
            return "warning"
        }
    }



    return {
        resetButton,
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,

        makeCall,
        getTotalCost,
        getTotalCallCost,
        getTotalSmsCost,
        sendSms,
        totalClassName,
        setCallCost,
        getCallCost,
        setSmsCost,
        getSmsCost,
        setWarningLevel,
        getWarningLevel,
        setCriticalLevel,
        getCriticalLevel,

    }
}