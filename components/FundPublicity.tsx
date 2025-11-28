

import React, { useState } from 'react';
import { ArrowLeft, Wrench, PiggyBank, TrendingUp, TrendingDown, Wallet, X, FileText, Image as ImageIcon } from 'lucide-react';
import { FundRecord } from '../types.ts';

interface FundPublicityProps {
  onBack: () => void;
  records: FundRecord[];
}

export const FundPublicity: React.FC<FundPublicityProps> = ({ onBack, records }) => {
  
  const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const DEPARTMENTS = ['技术部', '客服部', '运营部', '产品部', '行政部', '财务部'];

  const incomeRecords = records.filter(r => r.type === 'income');
  const expenseRecords = records.filter(r => r.type === 'expense');

  const totalIncome = incomeRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // --- Proof Viewing State ---
  const [viewingProject, setViewingProject] = useState<string | null>(null);
  
  // Get proofs for the currently viewed project
  const currentProofs = viewingProject 
      ? expenseRecords.filter(r => r.project === viewingProject).reduce((acc, r) => {
            if (r.invoiceImages) acc.invoices.push(...r.invoiceImages);
            if (r.productImages) acc.products.push(...r.productImages);
            return acc;
        }, { invoices: [] as string[], products: [] as string[] })
      : { invoices: [], products: [] };


  // --- Helper to build Income Matrix ---
  const buildIncomeMatrix = () => {
      const matrix: { [dept: string]: { [month: string]: number } } = {};
      const deptTotals: { [dept: string]: number } = {};
      const monthTotals: { [month: string]: number } = {};
      let grandTotal = 0;

      // Initialize
      DEPARTMENTS.forEach(d => { matrix[d] = {}; deptTotals[d] = 0; });
      MONTHS.forEach(m => monthTotals[m] = 0);

      // Fill
      incomeRecords.forEach(r => {
          if (!r.department) return;
          if (!matrix[r.department]) matrix[r.department] = {}; // safety
          
          const current = matrix[r.department][r.month] || 0;
          matrix[r.department][r.month] = current + r.amount;
          
          deptTotals[r.department] = (deptTotals[r.department] || 0) + r.amount;
          monthTotals[r.month] = (monthTotals[r.month] || 0) + r.amount;
          grandTotal += r.amount;
      });

      return { matrix, deptTotals, monthTotals, grandTotal };
  };

  // --- Helper to build Expense Matrix ---
  // Structure: Type -> Project -> Month -> Amount
  const buildExpenseMatrix = () => {
      const matrix: { [type: string]: { [project: string]: { [month: string]: number } } } = {};
      const typeTotals: { [type: string]: number } = {};
      const projectTotals: { [project: string]: number } = {};
      const monthTotals: { [month: string]: number } = {};
      let grandTotal = 0;

      // Initialize Month Totals
      MONTHS.forEach(m => monthTotals[m] = 0);

      expenseRecords.forEach(r => {
          if (!r.expenseType || !r.project) return;
          
          if (!matrix[r.expenseType]) matrix[r.expenseType] = {};
          if (!matrix[r.expenseType][r.project]) matrix[r.expenseType][r.project] = {};

          const current = matrix[r.expenseType][r.project][r.month] || 0;
          matrix[r.expenseType][r.project][r.month] = current + r.amount;

          typeTotals[r.expenseType] = (typeTotals[r.expenseType] || 0) + r.amount;
          projectTotals[r.project] = (projectTotals[r.project] || 0) + r.amount;
          monthTotals[r.month] = (monthTotals[r.month] || 0) + r.amount;
          grandTotal += r.amount;
      });

      return { matrix, typeTotals, projectTotals, monthTotals, grandTotal };
  };

  const { matrix: incMatrix, deptTotals, monthTotals: incMonthTotals, grandTotal: incGrandTotal } = buildIncomeMatrix();
  const { matrix: expMatrix, typeTotals, projectTotals, monthTotals: expMonthTotals, grandTotal: expGrandTotal } = buildExpenseMatrix();

  const StatCard = ({ title, amount, icon: Icon, colorClass, textClass }: any) => (
      <div className={`flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 ${colorClass}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${textClass} bg-white/60 shadow-sm`}>
              <Icon size={28} />
          </div>
          <div>
              <p className="text-slate-500 font-bold text-sm mb-1">{title}</p>
              <h3 className={`text-3xl font-mono font-bold ${textClass}`}>¥ {amount.toLocaleString()}</h3>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100 relative">
      
      {/* Proof Floating Window */}
      {viewingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                   <button 
                      onClick={() => setViewingProject(null)}
                      className="absolute top-4 right-4 z-10 bg-slate-100 p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                   >
                       <X size={24} />
                   </button>
                   
                   <div className="p-6 border-b border-slate-100 bg-slate-50">
                       <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                           <FileText className="text-blue-600" />
                           {viewingProject} - 支出凭证公示
                       </h3>
                   </div>

                   <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
                       {/* Left: Invoices */}
                       <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                           <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-lg">
                               <FileText size={20} /> 发票/收据 ({currentProofs.invoices.length})
                           </h4>
                           <div className="grid grid-cols-1 gap-4">
                               {currentProofs.invoices.length > 0 ? (
                                   currentProofs.invoices.map((url, i) => (
                                       <img key={i} src={url} className="w-full rounded-lg shadow-sm border border-slate-200 hover:scale-105 transition-transform cursor-zoom-in" alt="Invoice" />
                                   ))
                               ) : (
                                   <div className="text-slate-400 italic text-center py-10">暂无发票图片</div>
                               )}
                           </div>
                       </div>

                       {/* Right: Products/Scenes */}
                       <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                           <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-lg">
                               <ImageIcon size={20} /> 实物/现场 ({currentProofs.products.length})
                           </h4>
                           <div className="grid grid-cols-1 gap-4">
                               {currentProofs.products.length > 0 ? (
                                   currentProofs.products.map((url, i) => (
                                       <img key={i} src={url} className="w-full rounded-lg shadow-sm border border-slate-200 hover:scale-105 transition-transform cursor-zoom-in" alt="Product" />
                                   ))
                               ) : (
                                   <div className="text-slate-400 italic text-center py-10">暂无实物图片</div>
                               )}
                           </div>
                       </div>
                   </div>
              </div>
          </div>
      )}

      {/* Unified Header */}
      <div className="w-full flex items-center justify-center py-8 gap-6 relative z-10">
        <button 
            onClick={onBack} 
            className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-slate-200/60 active:scale-95"
        >
            <ArrowLeft size={20} /> <span className="font-bold">返回</span>
        </button>
        
        <div className="flex items-center gap-3 select-none opacity-90 scale-90 md:scale-100">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
                <Wrench size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-slate-800 font-bold text-2xl tracking-widest">急修到家</span>
                <span className="text-blue-600 text-[10px] tracking-[0.3em] font-bold mt-0.5">JIXIU DAOJIA</span>
            </div>
        </div>
        <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">乐捐收支公示</h1>
      </div>

      <div className="w-full max-w-[1400px] px-6 pb-20">
          
          {/* Top Stats */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
              <StatCard title="年度总收入" amount={totalIncome} icon={TrendingUp} colorClass="bg-emerald-50" textClass="text-emerald-600" />
              <StatCard title="年度总支出" amount={totalExpense} icon={TrendingDown} colorClass="bg-rose-50" textClass="text-rose-600" />
              <StatCard title="当前余额" amount={balance} icon={Wallet} colorClass="bg-blue-50" textClass="text-blue-600" />
          </div>

          <div className="space-y-12">
              
              {/* 1. Income Matrix Table */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                       <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><PiggyBank size={20} /></div>
                       <h3 className="text-xl font-bold text-slate-800">乐捐收入明细 (年度)</h3>
                   </div>
                   
                   <div className="overflow-x-auto">
                       <table className="w-full text-center border-collapse">
                           <thead>
                               <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                   <th className="p-4 text-left min-w-[100px] sticky left-0 bg-slate-50 z-10 border-b border-slate-200">部门</th>
                                   {MONTHS.map(m => <th key={m} className="p-4 min-w-[60px] border-b border-slate-200">{m}</th>)}
                                   <th className="p-4 min-w-[80px] bg-slate-100 border-b border-slate-200 text-slate-700">合计</th>
                               </tr>
                           </thead>
                           <tbody className="text-sm divide-y divide-slate-100">
                               {DEPARTMENTS.map(dept => {
                                   const rowTotal = deptTotals[dept] || 0;
                                   if (rowTotal === 0) return null; // Hide empty rows if desired, or keep them. Let's keep distinct ones from constant.

                                   return (
                                       <tr key={dept} className="hover:bg-slate-50 transition-colors">
                                           <td className="p-4 font-bold text-slate-700 text-left sticky left-0 bg-white border-r border-slate-100">{dept}</td>
                                           {MONTHS.map(m => (
                                               <td key={m} className="p-4 text-slate-500">
                                                   {incMatrix[dept]?.[m] ? (
                                                       <span className="text-emerald-600 font-mono font-medium">{incMatrix[dept][m]}</span>
                                                   ) : '-'}
                                               </td>
                                           ))}
                                           <td className="p-4 font-mono font-bold text-slate-800 bg-slate-50">{rowTotal}</td>
                                       </tr>
                                   );
                               })}
                               
                               {/* Grand Total Row */}
                               <tr className="bg-emerald-50/50 font-bold border-t-2 border-emerald-100">
                                   <td className="p-4 text-emerald-800 text-left sticky left-0 bg-emerald-50 border-r border-emerald-100">全公司合计</td>
                                   {MONTHS.map(m => (
                                       <td key={m} className="p-4 text-emerald-700 font-mono">
                                           {incMonthTotals[m] > 0 ? incMonthTotals[m] : '-'}
                                       </td>
                                   ))}
                                   <td className="p-4 text-emerald-900 font-mono bg-emerald-100">{incGrandTotal}</td>
                               </tr>
                           </tbody>
                       </table>
                   </div>
              </div>

              {/* 2. Expense Hierarchical Table */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                       <div className="bg-rose-100 text-rose-600 p-2 rounded-lg"><TrendingDown size={20} /></div>
                       <h3 className="text-xl font-bold text-slate-800">基金支出明细 (年度)</h3>
                   </div>
                   
                   <div className="overflow-x-auto">
                       <table className="w-full text-center border-collapse">
                           <thead>
                               <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                   <th className="p-4 text-left min-w-[120px] border-b border-slate-200">支出类型</th>
                                   <th className="p-4 text-left min-w-[150px] sticky left-0 bg-slate-50 z-10 border-b border-slate-200">具体项目 (点击查看)</th>
                                   {MONTHS.map(m => <th key={m} className="p-4 min-w-[60px] border-b border-slate-200">{m}</th>)}
                                   <th className="p-4 min-w-[80px] bg-slate-100 border-b border-slate-200 text-slate-700">合计</th>
                               </tr>
                           </thead>
                           <tbody className="text-sm divide-y divide-slate-100 border-b border-slate-200">
                               {Object.keys(expMatrix).map((type) => {
                                   const projects = Object.keys(expMatrix[type]);
                                   const typeTotal = typeTotals[type];
                                   
                                   return (
                                       <React.Fragment key={type}>
                                           {projects.map((proj, idx) => {
                                               const rowTotal = projectTotals[proj];
                                               
                                               return (
                                                   <tr key={proj} className="hover:bg-slate-50 transition-colors group">
                                                       {/* RowSpan for Type */}
                                                       {idx === 0 && (
                                                           <td rowSpan={projects.length + 1} className="p-4 font-bold text-slate-700 text-left bg-white align-top border-r border-slate-100 pt-6">
                                                               {type}
                                                               <div className="text-xs text-slate-400 mt-1 font-normal">分类小计: ¥{typeTotal}</div>
                                                           </td>
                                                       )}
                                                       
                                                       {/* Project Name - Clickable */}
                                                       <td 
                                                          onClick={() => setViewingProject(proj)}
                                                          className="p-4 font-medium text-blue-600 text-left sticky left-0 bg-white border-r border-slate-100 cursor-pointer group-hover:bg-blue-50 group-hover:underline decoration-blue-300 underline-offset-4 transition-all"
                                                          title="点击查看凭证"
                                                       >
                                                           {proj}
                                                       </td>

                                                       {/* Monthly Data */}
                                                       {MONTHS.map(m => (
                                                           <td key={m} className="p-4 text-slate-500 group-hover:bg-slate-50">
                                                               {expMatrix[type][proj][m] ? (
                                                                   <span className="text-rose-600 font-mono font-medium">{expMatrix[type][proj][m]}</span>
                                                               ) : '-'}
                                                           </td>
                                                       ))}
                                                       <td className="p-4 font-mono font-bold text-slate-800 bg-slate-50">{rowTotal}</td>
                                                   </tr>
                                               );
                                           })}
                                           
                                           {/* Type Subtotal Row (Optional, but requested "Big item has summary data") */}
                                           <tr className="bg-slate-50/50 border-t border-dashed border-slate-200">
                                               {/* First col is rowspanned above */}
                                               <td className="p-2 text-slate-400 text-xs text-right sticky left-0 bg-slate-50 italic pr-4">分类汇总 &gt;</td>
                                               {MONTHS.map(m => {
                                                    // Calculate Type Month Total on fly or pre-calc? Pre-calc would be better but let's do simple sum here
                                                    const val = projects.reduce((sum, p) => sum + (expMatrix[type][p][m] || 0), 0);
                                                    return <td key={m} className="p-2 text-slate-400 font-mono text-xs">{val > 0 ? val : '-'}</td>
                                               })}
                                               <td className="p-2 font-mono font-bold text-slate-600 text-xs bg-slate-100">{typeTotal}</td>
                                           </tr>
                                       </React.Fragment>
                                   );
                               })}

                               {/* Grand Total Row */}
                               <tr className="bg-rose-50/50 font-bold border-t-2 border-rose-100">
                                   <td colSpan={2} className="p-4 text-rose-800 text-right sticky left-0 bg-rose-50 border-r border-rose-100 pr-8">年度总支出合计</td>
                                   {MONTHS.map(m => (
                                       <td key={m} className="p-4 text-rose-700 font-mono">
                                           {expMonthTotals[m] > 0 ? expMonthTotals[m] : '-'}
                                       </td>
                                   ))}
                                   <td className="p-4 text-rose-900 font-mono bg-rose-100">{expGrandTotal}</td>
                               </tr>
                           </tbody>
                       </table>
                   </div>
              </div>

          </div>
      </div>
    </div>
  );
};
