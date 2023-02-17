import { Injectable } from '@nestjs/common';
import { Document } from './document.entity';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async save(document: Partial<Document>) {
    const documentEntity = this.documentRepository.create(document);
    await this.documentRepository.save(documentEntity);
  }
}
