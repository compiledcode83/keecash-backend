import { Module } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { DocumentService } from './document.service';

@Module({
  providers: [DocumentRepository, DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
