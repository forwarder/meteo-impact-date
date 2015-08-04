Package.describe({
  name: 'forwarder:impact-date',
  version: '0.0.1',
  summary: 'A reactive date picker for Meteor',
  git: 'https://github.com/forwarder/meteor-impact-date',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'templating',
    'less',
    'reactive-var'
  ], 'client');

  api.addFiles([
    'lib/datepicker.less',
    'lib/datepicker.html',
    'lib/datepicker.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('forwarder:impact-date');
  api.addFiles('tests/tests.js');
});
