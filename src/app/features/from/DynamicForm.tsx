'use client';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema
const schema = z
	.object({
		category: z.enum(['Regular', 'Flagship', 'Diamond'], {
			error: 'Please select a category',
		}),
		tin: z.string().optional().or(z.literal('')),
		file: z.any().optional(),
		date: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.category === 'Flagship' || data.category === 'Diamond') {
			if (!data.tin || data.tin.trim() === '') {
				ctx.addIssue({
					code: 'custom',
					path: ['tin'],
					message: 'Tin/Bin is required',
				});
			}
			if (!data.file || !(data.file instanceof File)) {
				ctx.addIssue({
					code: 'custom',
					path: ['file'],
					message: 'File is required',
				});
			}
			if (!data.date || data.date.trim() === '') {
				ctx.addIssue({
					code: 'custom',
					path: ['date'],
					message: 'Date is required',
				});
			}
		}
	});

type FormData = z.infer<typeof schema>;

const StaticForm = () => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			category: undefined,
			tin: '',
			file: null,
			date: '',
		},
	});
	const selectedCategory = watch('category');

	const onSubmit = (data: FormData) => {
		if (data.category === 'Regular') {
			console.log('Submitted data:', {
				category: data.category,
			});
		} else {
			console.log('Submitted data:', {
				category: data.category,
				tin: data.tin,
				fileName: data.file?.name,
				date: data.date,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='p-4 space-y-4'>
			{/* Radio Group */}
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Select Category
				</label>
				<Controller
					name='category'
					control={control}
					render={({ field }) => (
						<div className='mt-2 space-y-2'>
							{['Regular', 'Flagship', 'Diamond'].map((option) => (
								<label
									key={option}
									className='flex items-center space-x-2'>
									<input
										type='radio'
										value={option}
										checked={field.value === option}
										onChange={field.onChange}
										className='text-indigo-600 focus:ring-indigo-500'
									/>
									<span>{option}</span>
								</label>
							))}
						</div>
					)}
				/>
				{errors.category && (
					<p className='mt-2 text-sm text-red-600'>
						{errors.category.message}
					</p>
				)}
			</div>

			{/* Show Tin/Bin, Filepath, and DatePicker only for Flagship and Diamond */}
			{(selectedCategory === 'Flagship' ||
				selectedCategory === 'Diamond') && (
				<>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							{selectedCategory} Tin/Bin
						</label>
						<Controller
							name='tin'
							control={control}
							render={({ field }) => (
								<input
									{...field}
									className='block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								/>
							)}
						/>
						{errors.tin && (
							<p className='mt-2 text-sm text-red-600'>
								{errors.tin.message}
							</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							{selectedCategory} Filepath
						</label>
						<Controller
							name='file'
							control={control}
							render={({ field }) => (
								<input
									type='file'
									onChange={(e) => {
										const file = e.target.files?.[0] ?? null;
										field.onChange(file);
									}}
									className='block w-full mt-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
								/>
							)}
						/>
						{errors.file && (
							<p className='mt-2 text-sm text-red-600'>
								{typeof errors.file.message === 'string'
									? errors.file.message
									: null}
							</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							{selectedCategory} Date
						</label>
						<Controller
							name='date'
							control={control}
							render={({ field }) => (
								<input
									type='date'
									{...field}
									className='block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								/>
							)}
						/>
						{errors.date && (
							<p className='mt-2 text-sm text-red-600'>
								{errors.date.message}
							</p>
						)}
					</div>
				</>
			)}

			{/* Submit Button */}
			<button
				type='submit'
				className='p-2 text-white bg-green-500 rounded-md hover:bg-green-600'>
				Submit
			</button>
		</form>
	);
};

export default StaticForm;
