export interface SendgridGenericEmailInterface {
  header: string;
  body: string;
  email: string;
  emailTopImage: 'ok' | 'ko' | 'in_progress';
}
