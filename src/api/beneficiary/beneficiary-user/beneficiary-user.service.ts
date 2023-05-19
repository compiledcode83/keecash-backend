import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { BeneficiaryUser } from './beneficiary-user.entity';
import { UserService } from '@api/user/user.service';
import { AuthService } from '@api/auth/auth.service';
import { VerificationStatus } from '@api/user/user.types';

@Injectable()
export class BeneficiaryUserService {
  constructor(
    private readonly beneficiaryUserRepository: BeneficiaryUserRepository,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async findByPayerId(payerId: number, isAdmin: boolean) {
    return this.beneficiaryUserRepository.findByPayerId(payerId, isAdmin);
  }

  async create(param: Partial<BeneficiaryUser>) {
    // Check if beneficiary user already exists
    const beneficiary = await this.beneficiaryUserRepository.find({ where: param });

    if (beneficiary.length > 0) {
      return false;
    }

    const beneficiaryUserEntity = await this.beneficiaryUserRepository.create(param);

    return this.beneficiaryUserRepository.save(beneficiaryUserEntity);
  }

  async checkConditionsToAddBeneficiary(userId: number, masterUserId: number): Promise<void> {
    // ---------------------------------------------------------------------------
    //condition 1: Is beneficiary user exist in our DB ?
    // ---------------------------------------------------------------------------
    const user = await this.userService.findOne({ id: userId });

    const isUserExist = Boolean(user);

    if (!isUserExist) {
      throw new BadRequestException(`User not exist`);
    }

    // ---------------------------------------------------------------------------
    // condition 2: Is the master user trying to add himself as beneficiary ?
    // ---------------------------------------------------------------------------
    const isIdReferToMasterId = masterUserId === userId;

    if (isIdReferToMasterId) {
      throw new UnauthorizedException(`You can't add yourself as beneficiary`);
    }

    // ---------------------------------------------------------------------------
    // condition 3 : Is beneficiary already save ?
    // ---------------------------------------------------------------------------
    const beneficiary = await this.beneficiaryUserRepository.findByPayerIdAndPayeeId(
      masterUserId,
      userId,
    );

    const isBeneficiaryAlreadyAdded = Boolean(beneficiary);

    if (isBeneficiaryAlreadyAdded) {
      throw new UnauthorizedException(`Beneficiary already added`);
    }

    // ---------------------------------------------------------------------------
    // condition 4: Does the beneficiary user have their KYC or KYB validated ?
    // ---------------------------------------------------------------------------

    const isUserKycOrKybConfirmed =
      user.kycStatus === VerificationStatus.Validated ||
      user.kybStatus === VerificationStatus.Validated;

    if (!isUserKycOrKybConfirmed) {
      throw new UnauthorizedException(`Beneficiary account isn't validated`);
    }
  }
}
