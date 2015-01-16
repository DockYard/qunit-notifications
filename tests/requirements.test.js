(function() {
  "use strict";

  var iframe;

  QUnit.module("Requirements", {
    beforeEach: function(assert) {
      iframe = QUnit.addExampleSuite(assert, "stubs/empty.html?mocks");
    }
  });

  QUnit.test("Browser should support HTML5 notifications", function(assert) {
    assert.expect(2);
    assert.ok(
      "Notification" in iframe.contentWindow,
      "window object should have a \"Notification\" member"
    );
    assert.strictEqual(
      typeof iframe.contentWindow.Notification,
      "function",
      "window.Notification should be a function"
    );
  });

  QUnit.test("Notification mock should grant permission", function(assert) {
    assert.expect(4);

    assert.strictEqual(
      iframe.contentWindow.Notification.permission,
      "default",
      "Notification.permission should be set to \"default\" by default"
    );

    var permissionUpdated = false,
        newPermission = null;

    iframe.contentWindow.Notification.requestPermission(function(permission) {
      permissionUpdated = true;
      newPermission = permission;
    });
    assert.ok(permissionUpdated,
      "Permission should be granted synchronously"
    );
    assert.strictEqual(
      newPermission,
      "granted",
      "New permission should be \"granted\""
    );
    assert.strictEqual(
      iframe.contentWindow.Notification.permission,
      "granted",
      "Notification.permission should be updated to \"granted\""
    );
  });

  QUnit.test("Notification mock should hold a Promise object", function(assert) {
    assert.expect(3);

    var notification1 = new iframe.contentWindow.Notification("NOTIFICATION_TO_CLOSE_1"),
        notification2 = new iframe.contentWindow.Notification("NOTIFICATION_TO_CLOSE_2"),
        done = assert.async(),
        doneAll = assert.async();

    notification1.waitForClosed().then(function(result) {
      assert.ok(
        true,
        "notification.waitForClosed promise should be resolved once the notification is closed"
      );
      assert.ok(
        new Date().getTime() - result  < 10,
        "notification.waitForClosed promise result should be the current time => +" +
          (new Date().getTime() - result ) + "ms"
      );
      done();
    });

    iframe.contentWindow.Notification.waitForAllClosed().then(function() {
      assert.ok(
        true,
        "Notification.waitForAllClosed promise should be resolved one all notifications are closed"
      );
      iframe.updateCodeCoverage();
      doneAll();
    });

    setTimeout(notification1.close, 50);
    setTimeout(notification2.close, 100);
  });

  /*jshint nonew: false */
  QUnit.test("Sinon.JS should be able to spy notifications", function(assert) {
    assert.expect(7);

    iframe.contentWindow.Notification.requestPermission();
    assert.strictEqual(iframe.contentWindow.Notification.requestPermission.callCount, 1,
      "Notification.requestPermission should have been called once"
    );

    iframe.contentWindow.Notification("NOTIFICATION_WITHOUT_NEW");
    assert.ok(
      iframe.contentWindow.Notification.calledOnce,
      "Notification should have been called once"
    );
    assert.ok(
      !iframe.contentWindow.Notification.calledWithNew(),
      "Notification should not have been called with \"new\" keyword"
    );
    assert.ok(
      iframe.contentWindow.Notification.calledWithExactly("NOTIFICATION_WITHOUT_NEW"),
      "Notification should have been called with \"NOTIFICATION_WITHOUT_NEW\" argument"
    );

    new iframe.contentWindow.Notification("NOTIFICATION_WITH_NEW");
    assert.ok(
      iframe.contentWindow.Notification.calledTwice,
      "Notification should have been called twice now"
    );
    assert.ok(
      iframe.contentWindow.Notification.calledWithNew(),
      "Notification should have been called with \"new\" keyword"
    );
    assert.ok(
      iframe.contentWindow.Notification.calledWithExactly("NOTIFICATION_WITH_NEW"),
      "Notification should have been called with \"NOTIFICATION_WITH_NEW\" argument"
    );
  });

})();
