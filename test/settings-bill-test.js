const assert = require('assert');

const SettingsBill = require('../settings-bill');

describe('settings-bill', function(){

    const settingsBill = SettingsBill();

    it('should be able to record calls', function(){
        settingsBill.recordAction('call');
        assert.equal(1, settingsBill.actionsFor('call').length);
    });

    it('should be able to set the settings', function(){
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        }, settingsBill.getSettings())


    });

    it('should calculate the right totals', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(2.35, settingsBill.totals().smsTotal);
        assert.equal(3.35, settingsBill.totals().callTotal);
        assert.equal(5.70, settingsBill.totals().grandTotal);

    });

    it('should calculate the right totals for multiple actions', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(4.70, settingsBill.totals().smsTotal);
        assert.equal(6.70, settingsBill.totals().callTotal);
        assert.equal(11.40, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
    describe('Bill Settings', function () {

        describe('Set Values', function () {
            it('should be able to set the call cost', function () {
                let billsets = SettingsBill();
                billsets.setCriticalLevel(10);
                billsets.setCallCost(1.85);
                assert.equal(1.85, billsets.getCallCost());
    
                let billsets2 = SettingsBill();
    
                billsets2.setCallCost(3);
                assert.equal(3, billsets2.getCallCost());
            });
    
            it('should be able to set the sms cost', function () {
                let billsets3 = SettingsBill();
    
                billsets3.setSmsCost(0.85);
                assert.equal(0.85, billsets3.getSmsCost());
    
                let billsets4 = SettingsBill();
    
                billsets4.setSmsCost(2.85);
                assert.equal(2.85, billsets4.getSmsCost());
            });
    
            it('should be able to set the sms and call cost', function () {
                let billsets3 = SettingsBill();
    
                billsets3.setCallCost(3.85);
                billsets3.setSmsCost(2.85);
                assert.equal(3.85, billsets3.getCallCost());
                assert.equal(2.85, billsets3.getSmsCost());
    
                let billsets4 = SettingsBill();
    
                billsets4.setCallCost(5);
                billsets4.setSmsCost(2.50);
                assert.equal(5, billsets4.getCallCost());
                assert.equal(2.50, billsets4.getSmsCost());
            });
    
            it('should be able to set the warning level', function () {
                let billsets = SettingsBill();
    
                billsets.setWarningLevel(30);
                assert.equal(30, billsets.getWarningLevel());
            });
    
            it('should be able to set the critical level', function () {
                let billsets = SettingsBill();
    
                billsets.setCriticalLevel(45);
                assert.equal(45, billsets.getCriticalLevel());
            });
    
            it('should be able to set the warning level and critical level', function () {
                let billsets = SettingsBill();
    
                billsets.setWarningLevel(50);
                billsets.setCriticalLevel(75);
                assert.equal(50, billsets.getWarningLevel());
                assert.equal(75, billsets.getCriticalLevel());
            });
    
        });
    
        describe('Use Values', function () {
            it("should be able to use the call cost set", function () {
                let billsets = SettingsBill();
                billsets.setCriticalLevel(10);
                billsets.setCallCost(2.25);
                billsets.setSmsCost(0.85);
    
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
    
                assert.equal(6.75, billsets.getTotalCost());
                assert.equal(6.75, billsets.getTotalCallCost());
                assert.equal(0.00, billsets.getTotalSmsCost());
            });
    
            it("should be able to make 2 calls at 1.35 each", function () {
                let billsets = SettingsBill();
                billsets.setCriticalLevel(10);
                billsets.setCallCost(1.35);
                billsets.setSmsCost(0.85);
    
                billsets.makeCall();
                billsets.makeCall();
    
                assert.equal(2.70, billsets.getTotalCost());
                assert.equal(2.70, billsets.getTotalCallCost());
                assert.equal(0.00, billsets.getTotalSmsCost());
            });
    
            it("should be able to send 2 sms's at 0.85 each", function () {
                let billsets = SettingsBill();
                billsets.setCriticalLevel(10);
                billsets.setCallCost(1.35);
                billsets.setSmsCost(0.85);
    
                billsets.sendSms();
                billsets.sendSms();
    
                assert.equal(1.70, billsets.getTotalCost());
                assert.equal(0.00, billsets.getTotalCallCost());
                assert.equal(1.70, billsets.getTotalSmsCost());
            });
    
            it("should be able to make 1 call at 1.35 and send 2 sms's at 0.85 each", function () {
                let billsets = SettingsBill();
                billsets.setCriticalLevel(10);
                billsets.setCallCost(1.35);
                billsets.setSmsCost(0.85);
    
                billsets.makeCall();
                billsets.sendSms();
                billsets.sendSms();
    
                assert.equal(3.05, billsets.getTotalCost());
                assert.equal(1.35, billsets.getTotalCallCost());
                assert.equal(1.70, billsets.getTotalSmsCost());
            });
    
        });
    
        describe('warning and critical level', function () {
            it("should return a class name of 'warning' if warning is reached", function () {
                let billsets = SettingsBill();
    
                billsets.setCallCost(1.35);
                billsets.setSmsCost(0.85);
                billsets.setWarningLevel(5);
                billsets.setCriticalLevel(10);
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                assert.equal("warning", billsets.totalClassName());
            });
    
            it("should return a class name of 'critical' if critical is reached", function () {
                let billsets = SettingsBill();
    
                billsets.setCallCost(2.50);
                billsets.setSmsCost(0.85);
                billsets.setWarningLevel(10);
    
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                assert.equal("critical", billsets.totalClassName());
            });
    
            it("it should stop the Total Call cost from increasing when the critical level has been reached", function () {
                let billsets = SettingsBill();
    
                billsets.setCallCost(2.50);
                billsets.setSmsCost(0.85);
                billsets.setCriticalLevel(10);
    
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                assert.equal("critical", billsets.totalClassName());
                assert.equal(10, billsets.getTotalCallCost());
            });
    
            it("it should allow the total to increase after reaching the critical level and then upping the critical level", function () {
                let billsets = SettingsBill();
    
                billsets.setCallCost(2.50);
                billsets.setSmsCost(0.85);
                billsets.setWarningLevel(10);
                billsets.setCriticalLevel(10);
    
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                billsets.makeCall();
                assert.equal("critical", billsets.totalClassName());
                assert.equal(10, billsets.getTotalCallCost());
            
                billsets.setCriticalLevel(20);
    
                assert.equal("warning", billsets.totalClassName());
                billsets.makeCall();
                billsets.makeCall();
                assert.equal(15, billsets.getTotalCallCost());
            
            
            });
    
        });
    
    });
    
});