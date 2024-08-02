const { ObjectId } = require('mongodb');
const userModel = require('../models/user.model');
const { uploadError } = require('../utils/upload.error')
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);


exports.getAllUser = async function (req, res) {
    const users = await userModel.find().select("-password");
    res.status(200).json({ users });
}


exports.userInfo = async function (req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        console.log(`ID unknwon ${req.params.id}`)
    }
    const user = await userModel.findById(req.params.id).select("-password");
    res.status(200).json({ user });
}

// à faire
exports.updateUser = async function (req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        console.log(`ID unknwon ${req.params.id}`)
    };

    if (req.file !== null) {
        try {
            if (
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
            ) throw Error("invalid file");

            if (req.file.size > 500000) throw Error("max size");

        } catch (err) {
            const errors = uploadError(err);
            return res.status(201).json({ errors });
        }
        const fileName = req.params.id + Date.now() + ".jpg";

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/profile/${fileName}`
            )
        );

        try {
            await userModel.findOneAndUpdate(
                req.params.id,
                {
                    $set: {
                        picture: req.file !== null ? './uploads/profile' + fileName : '',
                    }
                },
                { setDefaultsOnInsert: true },
                (err, docs) => {
                    if (!err) return res.send(docs);
                    if (err) return res.status(500).send({ message: err });
                }
            );
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    }
}

exports.deleteUser = async function (req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        console.log(`ID unknwon ${req.params.id}`)
    }
    await userModel.findOneAndUpdate(
        { _id: req.params.id },
        {
            $addToSet: {
                isDeleted: true
            }
        },
        (err, docs) => {
            if (err) {
                console.log("failed to delete user" + err);
            }
            else {
                res.status(200).send(docs);
            }
        }
    )
}
