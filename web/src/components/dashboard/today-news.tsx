'use client';

import { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DAILY_HOT_API_PREFIX } from '@/config/api';
import { Website } from '@/app/(private)/hot-search/page';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoScrollList } from '@/components/ui/auto-scroll-list';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { useTranslations } from 'next-intl';

const TodayNews = () => {
	const t = useTranslations();
	const baseUrl = DAILY_HOT_API_PREFIX;
	const websites_to_craw = [
		'history',
		'bilibili',
		'acfun',
		'weibo',
		'zhihu',
		'zhihu-daily',
		'baidu',
		'douyin',
		'douban-movie',
		'douban-group',
		'tieba',
		'sspai',
		'ithome',
		'jianshu',
		'guokr',
		'thepaper',
		'toutiao',
		'36kr',
		'51cto',
		'juejin',
		'qq-news',
		'sina',
		'sina-news',
		'netease-news',
		'weread',
		'hellogithub',
	];

	const [websites, setWebsites] = useState<Website[]>([]);
	const [refreshStatus, setRefreshStatus] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleInitData = useCallback(async () => {
		setRefreshStatus(true);
		setError(null);
		try {
			const promises = websites_to_craw.map(async (website) => {
				try {
					const response = await fetch(`${baseUrl}/${website}`, {
						cache: 'no-cache',
					});
					if (response.ok) {
						return (await response.json()) as Website;
					}
					// 如果响应非 200，也抛出异常
					throw new Error(`Request failed: ${response.status}`);
				} catch (err) {
					console.warn(`Failed to fetch ${website}`, err);
					return null; // 返回 null 表示该站点获取失败
				}
			});

			const results = await Promise.all(promises);
			const valid = results.filter(
				(w): w is Website => !!w && w.data?.length > 0
			);
			setWebsites(valid);

			if (valid.length === 0) {
				setError(
					t('dashboard_today_hot_search_error_no_data') ?? 'No data available'
				);
			}
		} catch (err: any) {
			console.error('Fetch error:', err);
			setError(
				t('dashboard_today_hot_search_error_network') ?? 'Failed to load data'
			);
		} finally {
			setRefreshStatus(false);
		}
	}, [baseUrl, t]);

	useEffect(() => {
		handleInitData();
	}, []);

	return (
		<Card>
			<CardHeader className='flex justify-between items-center'>
				<div className='flex flex-col gap-1.5'>
					<CardTitle>{t('dashboard_today_hot_search')}</CardTitle>
					<CardDescription>
						{t('dashboard_today_hot_search_description')}
					</CardDescription>
				</div>
				<Link href={'/hot-search'}>
					<Button variant='ghost' className='text-sm text-muted-foreground'>
						{t('dashboard_today_hot_search_full')}
						<ChevronRight />
					</Button>
				</Link>
			</CardHeader>
			<CardContent className='flex-1'>
				{refreshStatus ? (
					<Skeleton className='w-full h-[140px]' />
				) : error ? (
					<div className='h-full w-full flex justify-center items-center text-muted-foreground text-xs'>
						{error}
					</div>
				) : (
					<AutoScrollList visibleCount={5} itemHeight={28} gap={1}>
						{websites.map((website, index) => (
							<Link
								key={index}
								href={website.data[0].url}
								target='_blank'
								className='flex w-full text-sm hover:text-primary transition-colors items-center justify-between p-1 hover:bg-muted'>
								<div className='truncate flex-1'>{website.data[0].title}</div>
								<div className='text-muted-foreground shrink-0 text-xs'>
									{website.title}
								</div>
							</Link>
						))}
					</AutoScrollList>
				)}
			</CardContent>
		</Card>
	);
};

export default TodayNews;
