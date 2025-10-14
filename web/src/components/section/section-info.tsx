'use client';

import { zhCN } from 'date-fns/locale/zh-CN';
import { enUS } from 'date-fns/locale/en-US';
import { getSectionDetail } from '@/service/section';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import SectionDocument from './section-document';
import { useRouter } from 'nextjs-toploader/app';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import CustomImage from '../ui/custom-image';
import { Skeleton } from '../ui/skeleton';

const SectionInfo = ({ id }: { id: number }) => {
	const locale = useLocale();
	const t = useTranslations();
	const router = useRouter();

	const {
		data: section,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ['getSectionDetail', id],
		queryFn: async () => {
			return getSectionDetail({ section_id: id });
		},
	});

	return (
		<>
			<div className='mb-5'>
				<img
					src={section?.cover ? section.cover : '/images/cover.jpg'}
					alt='cover'
					className='w-full h-52 object-cover'
				/>
			</div>

			{isFetching && !isFetched && (
				<div className='px-5 mb-3'>
					<Skeleton className='w-full h-40' />
				</div>
			)}

			{isFetched && (
				<>
					{section?.update_time && (
						<div className='px-5 mb-3'>
							<p className='text-xs text-muted-foreground'>
								{t('section_updated_at')}{' '}
								{formatDistance(new Date(section.update_time), new Date(), {
									addSuffix: true,
									locale: locale === 'zh' ? zhCN : enUS,
								})}
							</p>
						</div>
					)}
					<div className='flex flex-row justify-between items-center px-5 mb-3'>
						<div className='font-bold text-lg'>
							{section?.title ? section?.title : t('section_title_empty')}
						</div>
					</div>
					<div className='text-sm text-muted-foreground mb-3 px-5'>
						{section?.description
							? section?.description
							: t('section_description_empty')}
					</div>
					{section?.labels && section.labels.length > 0 && (
						<div className='flex flex-row gap-2 items-center px-5 mb-3 flex-wrap'>
							{section.labels.map((label) => {
								return (
									<Badge key={label.id} variant={'secondary'}>
										{label.name}
									</Badge>
								);
							})}
						</div>
					)}
					<div
						className='flex flex-row items-center gap-1 px-5 mb-3'
						onClick={(e) => {
							router.push(`/user/detail/${section?.creator.id}`);
							e.preventDefault();
							e.stopPropagation();
						}}>
						<CustomImage
							src={section?.creator.avatar!}
							alt='avatar'
							className='rounded-full object-cover w-5 h-5'
						/>
						<p className='text-xs text-muted-foreground'>
							{section?.creator.nickname}
						</p>
					</div>
				</>
			)}

			<div className='px-5'>
				<SectionDocument id={id} />
			</div>
		</>
	);
};

export default SectionInfo;
