import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { App } from '@code-not-art/sketch';

import DailySketchRouter from './DailySketchRouter';
import Homepage from './Homepage';

const root = document.getElementById('root');

createRoot(root!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="" element={<Homepage />} />
				<Route path="/day/:day" element={<DailySketchRouter />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
