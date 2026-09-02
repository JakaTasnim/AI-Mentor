import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {
    //1.Get data from frontend
    const {fullName, username, email, password} = req.body;

    //2.validate fields
    if([fullName, email, username, password].some((field) => !field || field.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    //3.Check if user already exists
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    });

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    //4.Create user
    const user = await User.create({
        fullName,
        email,
        password,
        username : username.toLowerCase(),
    });

    //5.Fetch created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering tthe user")
    }

    //6.send response
    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
})

export { registerUser };