// const httpStatus = require("http-status");
// const catchAsync = require("../../utilities/catchAsync");
// const config = require("../../config");
// const verifyJWT = require("../../utilities/verifyJWT");
// const AdminRoles = require("../modules/AdminRoles/AdminRoles.Service");
// const Admin = require("../modules/Admin/Admin.Service");
// const ApiError = require("../../errors/APIError");

// exports.ValidateAdmin = (...requiredRoles) =>
//     catchAsync(async (req, res, next) => {
//         const errorMessage = () => {
//             throw new ApiError(500, "Invalid Credentials");
//         };
//         const token = req.headers.authorization;
//         if (!token) errorMessage();
//         // console.log(req.cookies);
//         const refreshToken = req.cookies.refreshToken;

//         const accessTokenDecoded = verifyJWT(token, config.jwt.accessTokenKey);
//         const refreshTokenDecoded = verifyJWT(
//             refreshToken,
//             config.jwt.refreshTokenKey
//         );
//         if (!accessTokenDecoded.id) errorMessage();
//         if (!accessTokenDecoded.role) errorMessage();
//         if (accessTokenDecoded.id !== refreshTokenDecoded.id) errorMessage();
//         if (accessTokenDecoded.username !== refreshTokenDecoded.username)
//             errorMessage();
//         if (accessTokenDecoded.email !== refreshTokenDecoded.email)
//             errorMessage();

//         Admin.getAdminById(accessTokenDecoded.id, (err, admin) => {
//             if (err) {
//                 errorMessage();
//             }
//             // console.log(admin);
//             if (!admin.AdminID) errorMessage();
//             if (admin.AdminID !== refreshTokenDecoded.id) errorMessage();
//             if (admin.Username !== refreshTokenDecoded.username) errorMessage();
//             if (admin.Email !== refreshTokenDecoded.email) errorMessage();
//             // console.log('Found Admin');
//         });
//         AdminRoles.getRoleById(accessTokenDecoded.role, (err, role) => {
//             if (err) {
//                 errorMessage();
//             }
//             if (!requiredRoles.includes(role[0].RoleName)) errorMessage();
//             // console.log('Role is here', requiredRoles, role, accessTokenDecoded);
//         });

//         next();
//     });
