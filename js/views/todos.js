var app = app || {};

app.TodoView = Backbone.View.extend({

  tagName: "li",

  template: _.template($('#item-template').html()),

  events: {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'click .destroy': 'clear',
    'blur .edit': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // Re-renders the titles of the todo item.
  render: function() {
    this.$el.html(this.template(this.model.attributes));

    this.$el.toggleClass('completed', this.model.get('completed'));
    // this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());
  },

  // NEW - Determines if item should be hidden
  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.TodoFilter === 'completed') ||
      (isCompleted && app.TodoFilter === 'active')
    );
  },

  toggleCompleted: function() {
    this.model.toggle();
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // Close the `"editing"` mode, saving changes to the todo.
  close: function() {
    var value = this.$input.val().trim();

    if (value) {
      this.model.set({
        title: value
      });
    }

    this.$el.removeClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  clear: function() {
    this.model.destroy();
  }

});