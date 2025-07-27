import PassWordUpdate from '@/components/user/password-update';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import EmailBind from '@/components/user/email-bind';
import AvatarUpdate from '@/components/user/avatar-update';
import NicknameUpdate from '@/components/user/nickname-update';
import SloganUpdate from '@/components/user/slogan-update';
import DeleteUserButton from '@/components/user/delete-user-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import UserUUID from '@/components/user/uuid';

const AccountPage = async () => {
	const t = await getTranslations();
	return (
		<div className='px-5 pb-5'>
			<Card className='mb-5'>
				<CardContent className='space-y-5'>
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_avatar')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_avatar_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<AvatarUpdate />
						</div>
					</div>
					<Separator />
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_nickname')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_nickname_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<NicknameUpdate />
						</div>
					</div>
					<Separator />
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_slogan')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_slogan_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<SloganUpdate />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className='mb-5'>
				<CardContent className='space-y-5'>
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_email')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_email_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<EmailBind />
						</div>
					</div>
					<Separator />
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_password')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_password_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<PassWordUpdate />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className='mb-5'>
				<CardContent className='space-y-5'>
					<div className='flex justify-between items-center'>
						<Label className='flex flex-col gap-2 items-start'>
							{t('account_api_key')}
							<div className='text-[0.8rem] text-muted-foreground'>
								{t('account_api_key_description')}
							</div>
						</Label>
						<div className='flex flex-col gap-2'>
							<Link href={'/account/apikey'}>
								<Button variant={'outline'}>
									{t('account_api_key_go_to_configure')}
								</Button>
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className='mb-5'>
				<DeleteUserButton />
			</div>
			<div className='mb-5'>
				<UserUUID />
			</div>
		</div>
	);
};

export default AccountPage;
