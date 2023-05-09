import { Injectable } from '@nestjs/common';
import { CardRepository as CommonRepository } from '@app/card';

@Injectable()
export class CardRepository extends CommonRepository {}
