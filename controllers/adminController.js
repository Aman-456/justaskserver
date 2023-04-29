const User = require('../modals/User')
const Post = require('../modals/Posts')
const SavedPost = require('../modals/SavedPosts')
const ContactModal = require("../modals/contact")
const ReportedUsers = require('../modals/ReportedUsers')
const { default: mongoose } = require('mongoose')

exports.DELETEUSERByAdmin = async (req, res, next) => {
    try {
        const _id = req.body.id
        await User.updateMany({
            $set: {
                $pull: { friends: req.body.id },
                $pull: { acceptfriend: req.body.id },
                $pull: { friendrequest: req.body.id },
            }
        })
        const user = await User.findByIdAndDelete(_id);

        const users = await User.find({
            $and: [
                { _id: { $ne: mongoose.Types.ObjectId(req.user) } },
                { email: { $ne: "systemdesign9904@gmail.com" } },
            ]
        })
            .sort({ $natural: -1 })

        if (!user)
            return res.json({ type: "failure", result: "No user found" });
        // const { password, ...rest } = update
        res.json({
            type: "success", result: `Account has been deleted `, data: users
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message });
    }
}
exports.DeletePostByAdmin = async (req, res, next) => {
    try {
        const _id = req.body.id;
        await Post.findByIdAndDelete(_id)
        const users = await Post.find({})
            .sort({ $natural: -1 })
            .populate("Author")
        if (!users)
            return res.json({ type: "failure", result: "No user found" });
        // const { password, ...rest } = update
        res.json({
            type: "success", result: `Account has been deleted `, data: users
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message });
    }
}
exports.GetAll = async (req, res, next) => {
    try {
        console.log(req.user);
        const user = await User.find({
            $and: [
                { _id: { $ne: mongoose.Types.ObjectId(req.user) } },
                { email: { $ne: "systemdesign9904@gmail.com" } },
            ]
        })
            .sort({ $natural: -1 })
        if (!user) {
            return res.json({ type: "failure", result: "No user found" });
        }
        res.json({ type: "success", result: user })
    }
    catch (e) {
        console.log("error occured in getuser");
        res.json({ type: "failure", result: "No user found" });
    }
}
exports.reporteduserslist = async (req, res, next) => {
    // Reporteduser
    try {
        const user = await ReportedUsers.find({ completed: false })
            .sort({ $natural: -1 })
            .populate("by")
            .populate("reported")
        if (!user) {
            return res.json({ type: "failure", result: "No user found" });
        }
        res.json({ type: "success", result: user })
    }
    catch (e) {
        console.log("error occured in getuser");
        res.json({ type: "failure", result: "No user found" });
    }
}

exports.GetAllPosts = async (req, res, next) => {
    try {
        const user = await Post.find({})
            .sort({ $natural: -1 })
            .populate("Author")
        if (!user) {
            return res.json({ type: "failure", result: "No user found" });
        }
        res.json({ type: "success", result: user })
    }
    catch (e) {
        console.log("error occured in getuser");
        res.json({ type: "failure", result: "No user found" });
    }
}
// all contact us forms submissions
exports.getContact = async (req, res) => {
    try {
        const contact = await ContactModal.find({});
        res.status(200).json({ type: "success", result: contact });
        console.log(contact);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};
// post contact us form
exports.Contact = async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const message = req.body.message;
        if (username && email && message) {
            const contact = await new ContactModal(req.body)
            if (contact.save())
                res
                    .status(200)
                    .json({ type: "success", result: "Message Saved Successfully. we will get back to you as soon as possible" });

            else {
                res
                    .json({ type: "failure", result: "An Error Occured" });
            }
        }
        else {
            res
                .json({ type: "failure", result: "Fill out form correctly" });
        }

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};
exports.GraphData = async (req, res) => {
    try {
        const users = await User.find();
        const posts = await Post.find();
        const labels = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const userCounts = labels.map((month) =>
            users.filter((user) => user.createdAt.getMonth() === labels.indexOf(month)).length
        );

        const postCounts = labels.map((month) =>
            posts.filter((post) => post.createdAt.getMonth() === labels.indexOf(month)).length
        );

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Users',
                    data: userCounts,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Posts',
                    data: postCounts,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }

};

// contact us complete
exports.NoticeComplete = async (req, res) => {
    try {
        const complete = await ContactModal.findOneAndUpdate(
            { _id: req.body.id },
            { $set: { completed: true } }
        )
        if (complete) {
            const notices = await ContactModal.find({ completed: false })
                .sort({ $natural: -1 })
            res.status(200).json({ type: "success", result: notices });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ type: "failure", result: "Server Not Responding. Try Again" });
    }
};
// reported users complete
exports.ReportedComplete = async (req, res) => {
    try {
        const complete = await ReportedUsers.findOneAndUpdate(
            { _id: req.body.id },
            { $set: { completed: true } }
        )
        if (complete) {
            const notices = await ReportedUsers.find({ completed: false })
                .sort({ $natural: -1 })
                .populate("by")
                .populate("reported")
            res.status(200).json({ type: "success", result: notices });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ type: "failure", result: "Server Not Responding. Try Again" });
    }
};
