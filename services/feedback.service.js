const { Feedback } = require('./../models/system/feedback.model');

class FeedbackService {
    constructor () {

    }

    async CreateFeedback (member, body) {
        const { title, description, category} = body;

        var feedback = new Feedback({
            "title":          title,
            "description":    description,
            "category":       category,
            "requester": {
                "name":       member.name,
                "email":      member.email,
                "identifier": member.id
            }
        });

        return await feedback.save();
    }

    async GetOpenItems () {
        return await Feedback.find({"isClosed": false});
    }

    async GetClosedItems () {
        return await Feedback.find({"isClosed": true});
    }

    async GetItemsByCategory (category) {
        if (!category) {
            throw new Error('Unable to retreive feedback items. Category is missing.');
        }
        return await Feedback.find({"category": category});
    }

    async UpdateItem (id, body) {
        if (!body) {
            throw new Error('Unable to update feedback ticket.');
        }
        return await Feedback.findByIdAndUpdate(id, body);
    }
}
module.exports = Feedback;