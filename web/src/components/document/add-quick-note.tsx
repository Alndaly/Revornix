'use client';

import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDocument, getLabels } from '@/service/document';
import { useState } from 'react';
import { Loader2, OctagonAlert, Sparkles } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import MultipleSelector, {
	type Option,
} from '@/components/ui/multiple-selector';
import AddLabelDialog from '@/components/document/add-document-label-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '../ui/switch';
import { useRouter } from 'nextjs-toploader/app';
import { getAllMineSections } from '@/service/section';
import { Textarea } from '../ui/textarea';
import { useTranslations } from 'next-intl';
import { useUserContext } from '@/provider/user-provider';
import { Alert, AlertDescription } from '../ui/alert';
import { useSearchParams } from 'next/navigation';

const AddQuickNote = () => {
	const searchParams = useSearchParams();
	const sectionId = searchParams.get('section_id');
	const t = useTranslations();
	const { userInfo } = useUserContext();
	const formSchema = z.object({
		category: z.number(),
		content: z.string(),
		title: z.optional(
			z.string().min(1, { message: t('document_create_title_needed') })
		),
		description: z.optional(
			z.string().min(1, { message: t('document_create_description_needed') })
		),
		from_plat: z.string(),
		labels: z.optional(z.array(z.number())),
		sections: z.array(z.number()),
		auto_summary: z.boolean(),
	});
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: '',
			category: 2,
			auto_summary: false,
			from_plat: 'revornix-web',
			labels: [],
			sections: sectionId ? [Number(sectionId)] : [],
		},
	});
	const [showAddLabelDialog, setShowAddLabelDialog] = useState(false);

	const { data: labels } = useQuery({
		queryKey: ['getDocumentLabels'],
		queryFn: getLabels,
	});

	const { data: sections } = useQuery({
		queryKey: ['getMineDocumentSections'],
		queryFn: getAllMineSections,
	});

	const mutateCreateDocument = useMutation({
		mutationKey: ['createDocument', 'quick-note'],
		mutationFn: createDocument,
		onSuccess: (data) => {
			toast.success(t('document_create_success'));
			router.push(`/document/detail/${data.document_id}`);
		},
		onError: (error) => {
			toast.error(t('document_create_failed'));
			console.error(error);
		},
	});

	const getLabelByValue = (value: number): Option | undefined => {
		if (!labels) return;
		return labels.data
			.map((label) => {
				return { label: label.name, value: label.id };
			})
			.find((label) => label.value === value);
	};

	const getSectionByValue = (value: number): Option | undefined => {
		if (!sections) return;
		return sections.data
			.map((section) => {
				return { label: section.title, value: section.id };
			})
			.find((section) => section.value === value);
	};

	const onSubmitMessageForm = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		if (event) {
			if (typeof event.preventDefault === 'function') {
				event.preventDefault();
			}
			if (typeof event.stopPropagation === 'function') {
				event.stopPropagation();
			}
		}
		return form.handleSubmit(onFormValidateSuccess, onFormValidateError)(event);
	};

	const onFormValidateSuccess = async (values: z.infer<typeof formSchema>) => {
		mutateCreateDocument.mutate(values);
	};

	const onFormValidateError = (errors: any) => {
		toast.error(t('form_validate_failed'));
		console.error(errors);
	};
	return (
		<>
			<AddLabelDialog
				open={showAddLabelDialog}
				onOpenChange={setShowAddLabelDialog}
			/>
			<Form {...form}>
				<form onSubmit={onSubmitMessageForm} className='flex flex-col h-full'>
					<div className='flex flex-col w-full gap-5 flex-1 mb-5'>
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => {
								return (
									<FormItem className='w-full flex flex-col'>
										<Textarea
											{...field}
											placeholder={t('document_create_note_placeholded')}
											className='min-h-52'
										/>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						{labels ? (
							<FormField
								control={form.control}
								name='labels'
								render={({ field }) => {
									return (
										<FormItem className='space-y-0'>
											<MultipleSelector
												defaultOptions={labels.data.map((label) => {
													return { label: label.name, value: label.id };
												})}
												onChange={(value) => {
													field.onChange(
														value.map(({ label, value }) => value)
													);
												}}
												value={
													field.value &&
													field.value
														.map((id) => getLabelByValue(id))
														.filter((option) => !!option)
												}
												placeholder={t('document_create_label_placeholder')}
												emptyIndicator={
													<p className='text-center text-sm leading-10 text-gray-600 dark:text-gray-400'>
														{t('document_create_label_empty')}
													</p>
												}
											/>
											<div className='text-muted-foreground text-xs flex flex-row gap-0 items-center'>
												<span>{t('document_create_label_empty_tips')}</span>
												<Button
													type='button'
													className='text-xs text-muted-foreground px-0 py-0'
													variant={'link'}
													onClick={() => setShowAddLabelDialog(true)}>
													{t('document_create_label_add')}
												</Button>
											</div>
										</FormItem>
									);
								}}
							/>
						) : (
							<Skeleton className='h-10' />
						)}
						<FormField
							name='auto_summary'
							control={form.control}
							render={({ field }) => {
								return (
									<FormItem>
										<div className='flex flex-row gap-1 items-center'>
											<FormLabel className='flex flex-row gap-1 items-center'>
												{t('document_create_ai_summary')}
												<Sparkles size={15} />
											</FormLabel>
											<Switch
												disabled={!userInfo?.default_document_reader_model_id}
												checked={field.value}
												onCheckedChange={(e) => {
													field.onChange(e);
												}}
											/>
										</div>
										<FormDescription>
											{t('document_create_ai_summary_description')}
										</FormDescription>
										{!userInfo?.default_document_reader_model_id && (
											<Alert className='bg-destructive/10 dark:bg-destructive/20'>
												<OctagonAlert className='h-4 w-4 !text-destructive' />
												<AlertDescription>
													{t('document_create_ai_summary_engine_unset')}
												</AlertDescription>
											</Alert>
										)}
									</FormItem>
								);
							}}
						/>
						{sections ? (
							<FormField
								control={form.control}
								name='sections'
								render={({ field }) => {
									return (
										<FormItem className='space-y-0'>
											<MultipleSelector
												defaultOptions={sections.data.map((section) => {
													return { label: section.title, value: section.id };
												})}
												onChange={(value) => {
													field.onChange(
														value.map(({ label, value }) => value)
													);
												}}
												value={
													field.value &&
													field.value
														.map((id) => getSectionByValue(id))
														.filter((option) => !!option)
												}
												placeholder={t('document_create_section_choose')}
												emptyIndicator={
													<p className='text-center text-sm leading-10 text-gray-600 dark:text-gray-400'>
														{t('document_create_section_empty')}
													</p>
												}
											/>
										</FormItem>
									);
								}}
							/>
						) : (
							<Skeleton className='h-10' />
						)}
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={mutateCreateDocument.isPending || !form.watch('content')}>
						{t('document_create_submit')}
						{mutateCreateDocument.isPending && (
							<Loader2 className='size-4 animate-spin' />
						)}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default AddQuickNote;
