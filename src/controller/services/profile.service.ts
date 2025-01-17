import { Request, Response } from "express";
import { SafeUserPayload } from "../../types";
import { handleErrorResponse } from "../../helper/error-response";
import { findProfileByUserId, updateProfile } from "../repositories";
import manageCloudinaryImages from "../../helper/manage-cloudinary-img";

export async function getUserProfileByUserId(req: Request, res: Response) {
  const user = req.user as SafeUserPayload;
  if (!user) return handleErrorResponse(res, new Error("Unauthorized"), 401);
  res.status(200).json({ success: true, data: user });
}

export async function getUserProfileDetailsByUserId(
  req: Request,
  res: Response
) {
  const userId = (req.user as SafeUserPayload).id;
  if (!userId) return handleErrorResponse(res, new Error("Unauthorized"), 401);
  const profile = await findProfileByUserId(userId);
  if (!profile)
    return handleErrorResponse(res, new Error("Profile not found"), 404);
  res.status(200).json({ success: true, data: profile });
}

export async function updateProfileByUserId(req: Request, res: Response) {
  const user = req.user as SafeUserPayload;
  const { fullname, bio } = req.body;
  const image = req.file;
  if (!user) return handleErrorResponse(res, new Error("Unauthorized"), 401);
  if (!fullname || !bio || !image)
    return handleErrorResponse(res, new Error("No data to update"), 400);
  const { secure_url } = await manageCloudinaryImages({ buffer: image.buffer });
  const updatedProfile = await updateProfile(user.id, {
    fullname,
    bio,
    image: secure_url,
  });

  const profile = {
    id: updatedProfile.userId,
    fullname: updatedProfile.fullname,
    bio: updatedProfile.bio,
    image: updatedProfile.image,
  };

  res.status(200).json({ success: true, data: profile });
}
