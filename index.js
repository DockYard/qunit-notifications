QUnit.notifications = function(options) {
  options         = options || {};
  options.icons   = options.icons || {};
  options.timeout = options.timeout || 4000;
  options.titles  = options.titles || { passed: 'Passed!', failed: 'Failed!' };
  options.bodies  = options.bodies || { passed: '{{passed}} of {{total}} passed', failed: '{{passed}} passed. {{failed}} failed.' };

  var renderBody = function(body, details) {
    var strings = ['passed', 'failed', 'total', 'runtime']

    for (var i = 0; i < strings.length; i++) {
      var type = strings[i];
      body = body.replace("{{"+type+"}}", details[type]);
    }

    return body;
  };

  if (window.Notification) {
    QUnit.done(function(details) {
      var title;
      var _options = {};

      if (window.Notification && QUnit.urlParams.notification === 'true') {
        if (details.failed === 0) {
          title = options.titles.passed;
          _options.body = renderBody(options.bodies.passed, details);

          if (options.icons.passed) {
            _options.icon = options.icons.passed;
          }
        } else {
          title = options.titles.failed;
          _options.body = renderBody(options.bodies.failed, details);

          if (options.icons.failed) {
            _options.icon = options.icons.failed;
          }
        }

        var notification = new window.Notification(title, _options);

        setTimeout(function() {
          notification.close();
        }, options.timeout);
      }
    });

    $(window).on('load', function() {
      var toolbar = $('#qunit-testrunner-toolbar')[0];
      var notification = document.createElement( "input" );

      notification.type = "checkbox";
      notification.id = "qunit-notification";

      if (QUnit.urlParams.notification === 'true') {
        notification.checked = true;
      }

      notification.addEventListener('click', function(event) {
        if (event.target.checked) {
          window.Notification.requestPermission(function(status) {
            window.location = QUnit.url({notification: true});
          });
        } else {
          window.location = QUnit.url({notification: undefined});
        }
      }, false);
      toolbar.appendChild(notification);

      var label = document.createElement('label');
      label.setAttribute( "for", "qunit-notification" );
      label.setAttribute( "title", "Show notifications." );
      label.innerHTML = "Notifications";
      toolbar.appendChild(label);
    });
  }
};
