exports.signUpError = function (err) {
   return res.json({msg: "Email incorrect" ,  error: err})
}

exports.signInError = function (err) {
    console.log(err);
}