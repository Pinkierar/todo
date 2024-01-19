import {UploadedFile} from 'express-fileupload';
import fs from 'fs';

export const FileSystemService = new (class FileSystemService {
  public saveFile(file: UploadedFile, path: string): Promise<string>
  public async saveFile(
    file: UploadedFile,
    pathToFile: string,
  ): Promise<string> {
    const pathToFolder = this.getFolder(pathToFile);
    await this.createFolder(pathToFolder);

    await file.mv(pathToFile);

    return pathToFile;
  }

  public createFile(path: string): Promise<string>
  public async createFile(
    pathToFile: string,
  ): Promise<string> {
    await this.openFile(pathToFile);

    return pathToFile;
  }

  public getFileName(path: string): string
  public getFileName(
    pathToFile: string,
  ): string {
    const pathToFolder = this.getFolder(pathToFile);

    return pathToFile.replace(pathToFolder, '');
  }

  public getExt(name: string): string
  public getExt(
    pathToFile: string,
  ): string {
    return pathToFile.replace(/.*\.([^.]*)$/, '$1');
  }

  public openFile(path: string): Promise<number>
  public async openFile(
    pathToFile: string,
  ): Promise<number> {
    const pathToFolder = this.getFolder(pathToFile);
    await this.createFolder(pathToFolder);

    return await new Promise((resolve, reject) => {
      fs.open(pathToFile, 'w', (error, fd) => {
        if (error) return reject(error);

        resolve(fd);
      });
    });
  }

  public writeInFile(path: string, text: string): Promise<string>
  public writeInFile(path: string, data: NodeJS.ArrayBufferView): Promise<string>
  public async writeInFile(
    pathToFile: string,
    data: string | NodeJS.ArrayBufferView,
  ): Promise<string> {
    const fd = await this.openFile(pathToFile);

    return await new Promise((resolve, reject) => {
      fs.writeFile(fd, data, (err) => {
        if (err) return reject(err);

        resolve(pathToFile);
      });
    });
  }

  public addInFile(path: string, text: string): Promise<string>
  public addInFile(path: string, data: Uint8Array): Promise<string>
  public async addInFile(
    pathToFile: string,
    data: string | Uint8Array,
  ): Promise<string> {
    const pathToFolder = this.getFolder(pathToFile);
    await this.createFolder(pathToFolder);

    return await new Promise((resolve, reject) => {
      fs.appendFile(pathToFile, data, (err) => {
        if (err) return reject(err);

        resolve(pathToFile);
      });
    });
  }

  public existFolder(path: string): Promise<boolean>
  public existFolder(pathToFolder: string): Promise<boolean> {
    return fs.exists.__promisify__(pathToFolder);
  }

  public createFolder(path: string): Promise<string>
  public async createFolder(
    pathToFolder: string,
  ): Promise<string> {
    !fs.existsSync(pathToFolder) &&
    fs.mkdirSync(pathToFolder, {recursive: true});

    return Promise.resolve(pathToFolder);
  }

  public getFolder(path: string): string
  public getFolder(
    pathToFile: string,
  ): string {
    return pathToFile.replace(/\/?\\?[^\/\\]*$/, '');
  }
})();