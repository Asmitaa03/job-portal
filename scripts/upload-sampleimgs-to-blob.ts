import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";
import { put } from "@vercel/blob";

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN is not set. Create a read-write token in Vercel Blob and export it before running.");
    process.exit(1);
  }

  const localDir = join(process.cwd(), "public", "sampleimgs");
  let files: string[] = [];
  try {
    files = readdirSync(localDir).filter((f) => statSync(join(localDir, f)).isFile());
  } catch (e) {
    console.error("Could not read directory:", localDir);
    throw e;
  }

  if (files.length === 0) {
    console.log("No files found in public/sampleimgs/");
    return;
  }

  const mapping: Record<string, string> = {};

  for (const fileName of files) {
    const absPath = join(localDir, fileName);
    const fileBuffer = readFileSync(absPath);
    const blobKey = `sampleimgs/${fileName}`;
    console.log(`Uploading ${fileName} -> ${blobKey} ...`);
    const { url } = await put(blobKey, fileBuffer, {
      access: "public",
      token,
    });
    mapping[fileName] = url;
    console.log(`Uploaded: ${url}`);
  }

  const outPath = join(process.cwd(), "blob.sampleimgs.json");
  writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`\nWrote mapping to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


