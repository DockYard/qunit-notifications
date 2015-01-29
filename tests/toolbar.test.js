(function() {
  "use strict";

  var iframeDisabled, iframeEnabled;

  QUnit.module("Toolbar", {
    beforeEach: function(assert) {
      iframeDisabled = QUnit.addExampleSuite(assert, "stubs/success.html?mocks");
      iframeEnabled = QUnit.addExampleSuite(assert, "stubs/success.html?mocks&notifications");
    }
  });

  QUnit.test("A \"Notifications\" checkbox should appear in the toolbar", function(assert) {
    assert.expect(2);
    assert.strictEqual(
      iframeDisabled.contentDocument.getElementById("qunit-notifications").nodeName,
      "INPUT",
      "Checkbox #qunit-notifications should be inserted into the enabled page"
    );
    assert.strictEqual(
      iframeEnabled.contentDocument.getElementById("qunit-notifications").nodeName,
      "INPUT",
      "Checkbox #qunit-notifications should be inserted into the disabled page"
    );
  });

  QUnit.test("Checking \"Notifications\" should enable QUnit Notifications", function(assert) {
    assert.expect(4);
    iframeDisabled.contentDocument.getElementById("qunit-notifications").click();
    assert.ok(
      iframeDisabled.contentWindow.Notification.requestPermission.calledOnce,
      "window.Notification.requestPermission should be called once"
    );
    iframeDisabled.updateCodeCoverage();

    var done = assert.async();
    iframeDisabled.addEventListener("load", function() {
      iframeDisabled.contentWindow.QUnit.done(function() {
        assert.strictEqual(
          iframeDisabled.contentWindow.location.search,
          "?mocks&notifications",
          "URL query string should be ?mocks&notifications"
        );
        assert.strictEqual(
          iframeDisabled.contentWindow.QUnit.urlParams.notifications,
          true,
          "QUnit.urlParams.notifications should be true"
        );
        assert.ok(
          iframeDisabled.contentWindow.Notification.calledOnce,
          "window.Notification should be called once"
        );
        iframeDisabled.updateCodeCoverage();
        done();
      });
    });
  });

  QUnit.test("Unchecking \"Notifications\" should disable QUnit Notifications", function(assert) {
    assert.expect(4);
    iframeEnabled.contentDocument.getElementById("qunit-notifications").click();
    assert.ok(
      !iframeEnabled.contentWindow.Notification.requestPermission.called,
      "window.Notification.requestPermission should not be called"
    );
    iframeEnabled.updateCodeCoverage();

    var done = assert.async();
    iframeEnabled.addEventListener("load", function() {
      iframeEnabled.contentWindow.QUnit.done(function() {
        assert.strictEqual(
          iframeEnabled.contentWindow.location.search,
          "?mocks",
          "URL query string should be ?mocks"
        );
        assert.strictEqual(
          iframeEnabled.contentWindow.QUnit.urlParams.notifications,
          undefined,
          "QUnit.urlParams.notifications should be undefined"
        );
        assert.ok(
          !iframeEnabled.contentWindow.Notification.neverCalled,
          "window.Notification should never be called"
        );
        iframeEnabled.updateCodeCoverage();
        done();
      });
    });
  });

})();
