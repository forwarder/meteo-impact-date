var DEFAULT_THEME = 'default';

function getOptions() {
  var data = Template.currentData() || {};
  return _.extend(
    _.omit(data, 'calendar', 'options'),
    data.options || {}
  );
}

Template.ImpactDate.onCreated(function() {
  var instance = this;

  if (this.data.calendar instanceof ImpactCalendar) {
    this.calendar = this.data.calendar;
  } else {
    this.calendar = new ImpactCalendar(this.data);
  }

  this.autorun(function() {
    instance.calendar.configure(getOptions());
  });
});

Template.ImpactDate.events({
  'click [data-action="previous-year"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.previous('year');
  },
  'click [data-action="next-year"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.next('year');
  },
  'click [data-action="previous-month"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.previous('month');
  },
  'click [data-action="next-month"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.next('month');
  },
  'click [data-action="set-date"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.select(this.date);
  },
  'click [data-action="set-month"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.month(this.month);
  },
  'click [data-action="set-year"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.year(this.year);
  },
  'click [data-action="today"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.today();
  },
  'click [data-action="clear"]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    template.calendar.clear();
  }
});

Template.ImpactDate.helpers({
  context: function() {
    return _.extend(
      getOptions(), {
        calendar: Template.instance().calendar
      }
    );
  },
  wrapperClass: function() {
    var prefix = 'impact-date-',
        cls = [];

    cls.push(prefix + 'wrapper');
    cls.push(prefix + (this.theme || DEFAULT_THEME));

    if (!_.isUndefined(this.active)) {
      cls.push(prefix + (this.active ? 'active' : 'inactive'));
    }

    return cls.join(' ');
  },
  theme: function() {
    return this.theme || DEFAULT_THEME;
  },
  template: function() {
    return this.template || 'ImpactDateDefault';
  }
});

Template.ImpactDateDefault.onCreated(function() {
  var instance = this;

  this.show = new ReactiveVar();

  this.autorun(function() {
    var data = Template.currentData();
    instance.show.set(data && data.show || 'days');
  });
});

Template.ImpactDateDefault.events({
  'click [data-action="switch"]': function(event, template) {
    switch (template.show.get()) {
      case 'days':
        template.show.set('months');
        break;
      case 'months':
        template.show.set('years');
        break;
    }
  },
  'click [data-action="previous"]': function(event, template) {
    event.stopPropagation();
    switch (template.show.get()) {
      case 'days':
        this.calendar.previous('month');
        break;
      case 'months':
        this.calendar.previous('year');
        break;
      default:
        this.calendar.previous('years', 9);
    }
  },
  'click [data-action="next"]': function(event, template) {
    event.stopPropagation();
    switch (template.show.get()) {
      case 'days':
        this.calendar.next('month');
        break;
      case 'months':
        this.calendar.next('year');
        break;
      default:
        this.calendar.next('years', 9);
    }
  },
  'click [data-action="set-year"]': function(event, template) {
    template.show.set('months');
  },
  'click [data-action="set-month"]': function(event, template) {
    template.show.set('days');
  }
});

Template.ImpactDateDefault.helpers({
  title: function() {
    var years;
    switch(Template.instance().show.get()) {
      case 'days':
        return this.calendar.get().format('MMMM, YYYY');
      case 'months':
        return this.calendar.year();
      default:
        years = this.calendar.years();
        return years[0].year + '-' + years[years.length-1].year;
    }
  },
  grid: function() {
    switch(Template.instance().show.get()) {
      case 'days':
        return 'ImpactDateDays';
      case 'months':
        return 'ImpactDateMonths';
      default:
        return 'ImpactDateYears';
    }
  },

});

Template.ImpactDateDays.helpers({
  class: function() {
    var calendar = Template.parentData().calendar,
        cls = [];

    if (!this.day)
      return 'impact-date-empty';

    if (this.isToday())
      cls.push('impact-date-today');

    if (this.isAdjacent()) {
      cls.push('impact-date-adjacent');
    }

    if (calendar.isSelected(this)) {
      cls.push('impact-date-selected');
    }

    return cls.join(' ');
  }
});

Template.ImpactDateMonths.helpers({
  month: function() {
    return this.date.format('MMMM');
  },
  class: function() {
    var cls = [];

    if (this.isCurrent()) {
      cls.push('impact-date-current');
    }

    return cls.join(' ');
  }
});

Template.ImpactDateYears.helpers({
  class: function() {
    var cls = [];

    if (this.isCurrent()) {
      cls.push('impact-date-current');
    }

    return cls.join(' ');
  }
});
