module.exports.safe = true;
module.exports.manual_interpolation = true;

/*
 Purpose:
 Executes an array of nested actions in sequence. Each action must pass, if any child action fails,
 the error will be returned and processing will stop. This is useful to turn any spot expecting a single
 action into a block of multiple actions.

 Normalization shortcut:
   An array (of actions)

 Example:
 and:
 - {action1}
 - {action2}
 */

var _ = require("lodash");

module.exports.normalize = function (action, normalize_action) {
	if (_.isArray(action)) {
		action = { and: action };
	}
	if (_.has(action, "and")) {
		if (!_.isArray(action.and)) {
			throw new Error("[and] action must be an array of actions");
		}
		// Normalize nested actions
		action.and = _.map(action.and, normalize_action);
		return action;
	}
}

module.exports.process = function (context) {
	// and action just executes the nested actions
	return context.process_action(this.and);
}
