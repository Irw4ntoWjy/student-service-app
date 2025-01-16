<script
	lang="ts"
	generics="TData extends RowData, TValue extends Cell<TData, TValue>, TContext extends HeaderContext<TData, TValue> | CellContext<TData, TValue>"
>
	/* eslint-disable @typescript-eslint/no-explicit-any, no-undef */
	import type {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Cell,
		CellContext,
		ColumnDefTemplate,
		HeaderContext,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		RowData
	} from '@tanstack/table-core';
	import { RenderComponentConfig } from './render-component';

	type Props = {
		/** The cell or header field of the current cell's column definition. */
		content?:
			| (TContext extends HeaderContext<TData, TValue>
					? ColumnDefTemplate<HeaderContext<TData, TValue>>
					: TContext extends CellContext<TData, TValue>
						? ColumnDefTemplate<CellContext<TData, TValue>>
						: never)
			| undefined;
		/** The result of the `getContext()` function of the header or cell */
		context: TContext;
	};

	const { content, context }: Props = $props();
</script>

{#if typeof content === 'string'}
	{content}
{:else if typeof content === 'function'}
	{@const result = content(context as any)}
	{#if result instanceof RenderComponentConfig}
		{@const Component = result.component}
		<Component {...result.props} />
	{:else}
		{result}
	{/if}
{/if}
