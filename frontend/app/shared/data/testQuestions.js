export const testQuestions = [
  {
    id: "1",
    title: "Two Sum Problem",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is the optimal time complexity for Two Sum problem?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctOptionIndex: 2,
      },
      {
        index: 2,
        type: "mcq",
        question: "Which data structure is commonly used to solve Two Sum in O(n) time?",
        options: ["Array", "HashMap/Map", "Stack", "Queue"],
        correctOptionIndex: 1,
      },
      {
        index: 3,
        type: "mcq",
        question: "In Two Sum, what do we store as key in HashMap?",
        options: ["Array index", "Array element", "Target - current element", "Sum of elements"],
        correctOptionIndex: 1,
      },
      {
        index: 4,
        type: "mcq",
        question: "What is the space complexity of HashMap approach for Two Sum?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctOptionIndex: 1,
      },
      {
        index: 5,
        type: "mcq",
        question: "Can Two Sum be solved without extra space?",
        options: ["Yes, always", "No, never", "Yes, if array is sorted", "Only for positive numbers"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "2",
    title: "Best Time to Buy and Sell Stock",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is the optimal approach for single transaction stock problem?",
        options: ["Brute force", "Dynamic Programming", "Single pass with min tracking", "Sorting"],
        correctOptionIndex: 2,
      },
      {
        index: 2,
        type: "mcq",
        question: "What should we track while iterating through prices?",
        options: ["Maximum price", "Minimum price so far", "Average price", "Last price"],
        correctOptionIndex: 1,
      },
      {
        index: 3,
        type: "mcq",
        question: "Time complexity of optimal stock problem solution?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctOptionIndex: 2,
      },
      {
        index: 4,
        type: "mcq",
        question: "Space complexity of optimal solution?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctOptionIndex: 2,
      },
      {
        index: 5,
        type: "mcq",
        question: "What if we can make multiple transactions?",
        options: ["Same approach", "Need DP", "Buy every dip, sell every peak", "Not possible"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "3",
    title: "Valid Parentheses",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "Which data structure is best for Valid Parentheses problem?",
        options: ["Queue", "Stack", "Array", "HashMap"],
        correctOptionIndex: 1,
      },
      {
        index: 2,
        type: "mcq",
        question: "What do we push onto the stack?",
        options: ["Closing brackets", "Opening brackets", "All brackets", "Nothing"],
        correctOptionIndex: 1,
      },
      {
        index: 3,
        type: "mcq",
        question: "When do we know parentheses are invalid?",
        options: ["Stack is empty when popping", "Stack not empty at end", "Both A and B", "Never"],
        correctOptionIndex: 2,
      },
      {
        index: 4,
        type: "mcq",
        question: "Time complexity of valid parentheses check?",
        options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
        correctOptionIndex: 1,
      },
      {
        index: 5,
        type: "mcq",
        question: "What's the maximum space needed?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n/2)"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "4",
    title: "Merge Two Sorted Lists",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is the time complexity of merging two sorted linked lists?",
        options: ["O(m + n)", "O(m * n)", "O(max(m,n))", "O(min(m,n))"],
        correctOptionIndex: 0,
      },
      {
        index: 2,
        type: "mcq",
        question: "Which approach is more space efficient?",
        options: ["Recursive", "Iterative", "Both same", "Depends on input"],
        correctOptionIndex: 1,
      },
      {
        index: 3,
        type: "mcq",
        question: "What do we do when one list is exhausted?",
        options: ["Stop merging", "Append remaining list", "Start over", "Return null"],
        correctOptionIndex: 1,
      },
      {
        index: 4,
        type: "mcq",
        question: "Space complexity of iterative approach?",
        options: ["O(1)", "O(m)", "O(n)", "O(m+n)"],
        correctOptionIndex: 0,
      },
      {
        index: 5,
        type: "mcq",
        question: "What is a dummy node used for?",
        options: ["Extra storage", "Simplify edge cases", "Better performance", "Memory optimization"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "5",
    title: "Maximum Subarray (Kadane's Algorithm)",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is Kadane's algorithm used for?",
        options: ["Sorting", "Maximum subarray sum", "Binary search", "Graph traversal"],
        correctOptionIndex: 1,
      },
      {
        index: 2,
        type: "mcq",
        question: "Time complexity of Kadane's algorithm?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctOptionIndex: 2,
      },
      {
        index: 3,
        type: "mcq",
        question: "When do we reset the current sum to 0?",
        options: ["Never", "When it becomes negative", "At every element", "At the end"],
        correctOptionIndex: 1,
      },
      {
        index: 4,
        type: "mcq",
        question: "What if all numbers are negative?",
        options: ["Return 0", "Return the maximum element", "Return -1", "Algorithm fails"],
        correctOptionIndex: 1,
      },
      {
        index: 5,
        type: "mcq",
        question: "Space complexity of Kadane's algorithm?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "6",
    title: "Binary Search",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is the prerequisite for binary search?",
        options: ["Array should be sorted", "Array should be unsorted", "Array should have duplicates", "No prerequisite"],
        correctOptionIndex: 0,
      },
      {
        index: 2,
        type: "mcq",
        question: "Time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctOptionIndex: 1,
      },
      {
        index: 3,
        type: "mcq",
        question: "How do we avoid integer overflow in mid calculation?",
        options: ["mid = (left + right) / 2", "mid = left + (right - left) / 2", "Use floating point", "Not possible"],
        correctOptionIndex: 1,
      },
      {
        index: 4,
        type: "mcq",
        question: "When do we update left pointer?",
        options: ["When target > mid", "When target < mid", "When target = mid", "Never"],
        correctOptionIndex: 0,
      },
      {
        index: 5,
        type: "mcq",
        question: "Space complexity of iterative binary search?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctOptionIndex: 2,
      },
    ],
  },
];

// Default fallback for any question number
export const getTestQuestions = (questionId) => {
  const found = testQuestions.find(q => q.id === questionId);
  if (found) return found;
  
  // Return default question set for any missing ID
  return {
    id: questionId,
    title: "Programming Fundamentals",
    items: [
      {
        index: 1,
        type: "mcq",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        correctOptionIndex: 0,
      },
      {
        index: 2,
        type: "mcq",
        question: "Which of the following is a primitive data type?",
        options: ["Array", "Object", "String", "Function"],
        correctOptionIndex: 2,
      },
      {
        index: 3,
        type: "mcq",
        question: "What does '===' operator do in JavaScript?",
        options: ["Assignment", "Equality check", "Strict equality check", "Not equal"],
        correctOptionIndex: 2,
      },
      {
        index: 4,
        type: "mcq",
        question: "Which loop is guaranteed to execute at least once?",
        options: ["for loop", "while loop", "do-while loop", "foreach loop"],
        correctOptionIndex: 2,
      },
      {
        index: 5,
        type: "mcq",
        question: "What is the result of 5 + '5' in JavaScript?",
        options: ["10", "55", "'55'", "Error"],
        correctOptionIndex: 2,
      },
    ],
  };
};