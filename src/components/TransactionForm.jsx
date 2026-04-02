import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { 
  selectEditingTransaction, 
  selectCategories,
  addTransaction, 
  updateTransaction 
} from '../store/useFinanceStore';

const TransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const editingTransaction = useSelector(selectEditingTransaction);
  const categories = useSelector(selectCategories);
  const isEditing = !!editingTransaction;
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Groceries',
    type: 'expense',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
        description: editingTransaction.description
      });
    }
  }, [editingTransaction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTimeout(validate, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ date: true, amount: true, category: true, description: true });

    if (!validate()) {
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (isEditing) {
      dispatch(updateTransaction({ id: editingTransaction.id, updates: transactionData }));
    } else {
      dispatch(addTransaction(transactionData));
    }

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={formRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Transaction Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange('type', 'income')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  formData.type === 'income'
                    ? 'bg-success text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'expense')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  formData.type === 'expense'
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label 
              htmlFor="date"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.date && touched.date 
                    ? 'border-danger ring-1 ring-danger' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                aria-invalid={errors.date && touched.date ? 'true' : 'false'}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
            </div>
            {errors.date && touched.date && (
              <p id="date-error" className="mt-1 text-sm text-danger">
                {errors.date}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label 
              htmlFor="amount"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Amount
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.amount && touched.amount 
                    ? 'border-danger ring-1 ring-danger' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                aria-invalid={errors.amount && touched.amount ? 'true' : 'false'}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
              />
            </div>
            {errors.amount && touched.amount && (
              <p id="amount-error" className="mt-1 text-sm text-danger">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label 
              htmlFor="category"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                errors.category && touched.category 
                  ? 'border-danger ring-1 ring-danger' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              aria-invalid={errors.category && touched.category ? 'true' : 'false'}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="mt-1 text-sm text-danger">
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Enter description..."
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                errors.description && touched.description 
                  ? 'border-danger ring-1 ring-danger' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              aria-invalid={errors.description && touched.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && touched.description && (
              <p id="description-error" className="mt-1 text-sm text-danger">
                {errors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {isEditing ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransactionForm;
