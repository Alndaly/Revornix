'use client';

import { useUserContext } from '@/provider/user-provider';
import { bindGitHub } from '@/service/user';
import { utils } from '@kinda/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const GitHubBindPage = () => {
	const { refreshUserInfo } = useUserContext();
	const searchParams = useSearchParams();
	const router = useRouter();

	const code = searchParams.get('code');

	const onBindGitHubUser = async (code: string) => {
		const [res, err] = await utils.to(bindGitHub({ code }));
		if (err || !res) {
			toast.error(err.message);
			await utils.sleep(1000);
			router.push('/account');
			return;
		}
		router.push('/account');
		refreshUserInfo();
	};

	useEffect(() => {
		if (!code) {
			return;
		}
		onBindGitHubUser(code);
	}, []);

	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			Redirecting...
		</div>
	);
};

export default GitHubBindPage;
