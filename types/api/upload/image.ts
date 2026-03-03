import type { ImageId } from "../../domain";
import type { URL } from "../../utility/scalars";

export type UploadImagePostResponse = {
  id: ImageId;
  imageUrl: URL;
};
