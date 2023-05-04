import { memo, FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { SearchDataType } from './types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const Search: FC<NodeProps<SearchDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

	const { documents, updateNode } = useStore(selector, shallow);

	useEffect(() => {
		const documentId = data.document?.id;
		const isDocumentDeleted = documents.find((document) => document.id === documentId);
		if (!isDocumentDeleted) {
			updateNode(id, {
				...data,
				document: documents[0],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [documents]);

	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg `,
				)}
			>
				<NodeTemplate
					{...props}
					title="Docs Search"
					fieldName="Search Query"
					color="sky"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{() => (
						<>
							<TextAreaTemplate
								{...props}
								presentText={presentText}
								setText={setText}
							/>
							<div className="text-md flex flex-col gap-2 ">
								<InputNodesList
									data={data}
									id={id}
									setText={setText}
									updateNode={updateNode}
									type={type}
								/>
							</div>
						</>
					)}
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="search-input"
				style={{
					left: '-4.1rem',
					backgroundColor: 'rgb(248 250 252)',
				}}
				className="top-1/2 flex h-10 gap-1 border-1 border-slate-700"
			>
				<div className=" pointer-events-none h-full w-5 bg-sky-300"></div>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					Doc
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="search-output"
				className="h-4 w-4"
			/>
		</div>
	);
};

export default memo(Search);
