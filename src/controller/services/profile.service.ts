import { NextFunction, Request, Response } from "express";
import { SafeUserPayload, UserPayload } from "@/types";
import { PayloadError } from "@/helper/error-response";
import { findProfileByUserId, updateProfile } from "@/controller/repositories";
import manageCloudinaryImages from "@/helper/manage-cloudinary-img";

export async function getUserProfileByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) throw new PayloadError("Unauthorized", 401);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getUserProfileDetailsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req.user as SafeUserPayload).id;
    if (!userId) throw new PayloadError("Unauthorized", 401);
    const profile = await findProfileByUserId(userId);
    if (!profile) throw new PayloadError("Profile not found", 404);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as SafeUserPayload;
    const { fullname, bio } = req.body;
    const image = req.file;
    if (!user) throw new PayloadError("Unauthorized", 401);
    if (!fullname || !bio || !image) throw new PayloadError("Invalid data", 400);
    const { secure_url } = await manageCloudinaryImages({
      buffer: image.buffer,
    });
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
  } catch (error) {
    next(error);
  }
}
