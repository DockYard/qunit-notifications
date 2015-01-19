(function() {
  "use strict";

  // HTML5 notifications mock
  // ------------------------

  // This allow running tests in browsers without HTML5 notifications
  // This is particularly useful for continuous integration testing, using PhantomJS
  // Also, this prevents showing unwanted notifications during testing
  var NotificationMock = function NotificationMock(title) {
    var closeDeferred = RSVP.defer();
    setTimeout(function() {
      closeDeferred.reject("Notification \"" + title + "\" timeouted after 5000ms");
    }, 5000);
    NotificationMock.closePromises.push(closeDeferred.promise);
    return {
      closePromise: closeDeferred.promise,
      waitForClosed: function() {
        return this.closePromise;
      },
      closed: false,
      close: function() {
        if (this.closed) {
          throw new Error("Notification " + title + " is already closed");
        }
        return closeDeferred.resolve(new Date().getTime());
      }
    };
  };

  NotificationMock.closePromises = [];

  NotificationMock.waitForAllClosed = function waitForAllClosed() {
    return RSVP.allSettled(NotificationMock.closePromises);
  },

  NotificationMock.permission = "default";

  NotificationMock.requestPermission = function requestPermission(callback) {
    this.permission = "granted";
    callback && callback(this.permission);
  };

  QUnit.config.urlConfig.push({
    id: "mocks",
    label: "Mocks",
    tooltip: "Mock notifications"
  });

  if (QUnit.urlParams.mocks) {

    // Replace native Notification with mock object
    // We can't use sinon.stub() here, because window.Notification may not exist
    window.Notification = NotificationMock;

    // Enable spying
    sinon.spy(window, "Notification");
    sinon.spy(window.Notification, "requestPermission");
  }

})();
