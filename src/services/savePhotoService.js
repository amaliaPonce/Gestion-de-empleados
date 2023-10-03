const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid");

const { saveFileError } = require("./errorService");

const savePhotoService = async (imgData) => {
  try {
    const uploadsDir = path.join(
      __dirname,
      "..",
      "..",
      process.env.UPLOADS_DIR
    );

    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir);
    }

    const imgName = `${uuid.v4()}.jpg`;

    const imgPath = path.join(uploadsDir, imgName);

    // Guardar la imagen sin redimensionar
    await fs.writeFile(imgPath, imgData);

    return imgName;
  } catch (err) {
    console.error("Error al guardar la imagen:", err);
    throw saveFileError();
  }
};

module.exports = savePhotoService;
