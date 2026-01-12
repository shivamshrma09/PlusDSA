export const codingQuestions = [
  {
    time: 40,
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: ["1 <= n <= 45"],
    examples: [{ input: "n = 2", output: "2", explanation: "1+1 or 2 steps" }],
    testCases: [
      { input: "n = 1", expected: "1", inputData: "1" },
      { input: "n = 2", expected: "2", inputData: "2" },
      { input: "n = 3", expected: "3", inputData: "3" },
      { input: "n = 4", expected: "5", inputData: "4" },
      { input: "n = 5", expected: "8", inputData: "5" },
      { input: "n = 10", expected: "89", inputData: "10" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function climbStairs(n) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def climbStairs(n):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 65,
    title: "Course Schedule",
    difficulty: "Medium",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
    constraints: ["1 <= numCourses <= 10^5", "0 <= prerequisites.length <= 5000"],
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 then 1" }],
    testCases: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", expected: "true", inputData: "2\n[[1,0]]" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", expected: "false", inputData: "2\n[[1,0],[0,1]]" },
      { input: "numCourses = 1, prerequisites = []", expected: "true", inputData: "1\n[]" },
      { input: "numCourses = 3, prerequisites = [[1,0],[2,1]]", expected: "true", inputData: "3\n[[1,0],[2,1]]" },
      { input: "numCourses = 4, prerequisites = [[1,0],[2,1],[3,2],[1,3]]", expected: "false", inputData: "4\n[[1,0],[2,1],[3,2],[1,3]]" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function canFinish(numCourses, prerequisites) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def canFinish(numCourses, prerequisites):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 85,
    title: "Design Twitter",
    difficulty: "Hard",
    description: "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user's news feed.",
    constraints: ["1 <= userId, followerId, followeeId <= 500", "0 <= tweetId <= 10^4"],
    examples: [{ input: "Twitter operations", output: "Feed with tweets", explanation: "Design Twitter system" }],
    testCases: [
      { input: "postTweet(1, 5); getNewsFeed(1)", expected: "[5]", inputData: "postTweet 1 5\ngetNewsFeed 1" },
      { input: "postTweet(1, 5); follow(1, 2); postTweet(2, 6); getNewsFeed(1)", expected: "[6, 5]", inputData: "postTweet 1 5\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1" },
      { input: "postTweet(1, 1); follow(2, 1); getNewsFeed(2)", expected: "[1]", inputData: "postTweet 1 1\nfollow 2 1\ngetNewsFeed 2" },
      { input: "postTweet(1, 1); follow(2, 1); unfollow(2, 1); getNewsFeed(2)", expected: "[]", inputData: "postTweet 1 1\nfollow 2 1\nunfollow 2 1\ngetNewsFeed 2" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "class Twitter {\n  constructor() {\n    // Initialize\n  }\n}" },
      { language: "Python", code: "class Twitter:\n    def __init__(self):\n        # Initialize\n        pass\n    \n    def postTweet(self, userId, tweetId):\n        # Write your solution here\n        pass\n    \n    def getNewsFeed(self, userId):\n        # Write your solution here\n        pass\n    \n    def follow(self, followerId, followeeId):\n        # Write your solution here\n        pass\n    \n    def unfollow(self, followerId, followeeId):\n        # Write your solution here\n        pass" },
      { language: "Java", code: "class Twitter {\n    public Twitter() {\n        // Initialize\n    }\n}" }
    ]
  },
  {
    time: 35,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth.",
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]", "-100 <= Node.val <= 100"],
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Maximum depth is 3" }],
    testCases: [
      { input: "root = []", expected: "0", inputData: "[]" },
      { input: "root = [1]", expected: "1", inputData: "[1]" },
      { input: "root = [3,9,20,null,null,15,7]", expected: "3", inputData: "[3,9,20,null,null,15,7]" },
      { input: "root = [1,null,2]", expected: "2", inputData: "[1,null,2]" },
      { input: "root = [1,2,3,4,null,null,5]", expected: "3", inputData: "[1,2,3,4,null,null,5]" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function maxDepth(root) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def maxDepth(root):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 55,
    title: "Coin Change",
    difficulty: "Medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    examples: [{ input: "coins = [1,3,4], amount = 6", output: "2", explanation: "6 = 3 + 3" }],
    testCases: [
      { input: "coins = [1,3,4], amount = 6", expected: "2", inputData: "[1,3,4]\n6" },
      { input: "coins = [2], amount = 3", expected: "-1", inputData: "[2]\n3" },
      { input: "coins = [1], amount = 0", expected: "0", inputData: "[1]\n0" },
      { input: "coins = [1,2,5], amount = 11", expected: "3", inputData: "[1,2,5]\n11" },
      { input: "coins = [5,10,25], amount = 30", expected: "2", inputData: "[5,10,25]\n30" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function coinChange(coins, amount) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def coinChange(coins, amount):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 45,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" }],
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]", inputData: "[2,7,11,15]\n9" },
      { input: "nums = [3,2,4], target = 6", expected: "[1,2]", inputData: "[3,2,4]\n6" },
      { input: "nums = [3,3], target = 6", expected: "[0,1]", inputData: "[3,3]\n6" },
      { input: "nums = [-1,-2,-3,-4,-5], target = -8", expected: "[2,4]", inputData: "[-1,-2,-3,-4,-5]\n-8" },
      { input: "nums = [0,4,3,0], target = 0", expected: "[0,3]", inputData: "[0,4,3,0]\n0" },
      { input: "nums = [1,2,3,4,5], target = 9", expected: "[3,4]", inputData: "[1,2,3,4,5]\n9" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function twoSum(nums, target) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def twoSum(nums, target):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 70,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Given a string s, return the longest palindromic substring in s.",
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters"],
    examples: [{ input: "s = \"babad\"", output: "\"bab\"", explanation: "\"aba\" is also a valid answer" }],
    testCases: [
      { input: "s = \"babad\"", expected: "bab", inputData: "babad" },
      { input: "s = \"cbbd\"", expected: "bb", inputData: "cbbd" },
      { input: "s = \"a\"", expected: "a", inputData: "a" },
      { input: "s = \"ac\"", expected: "a", inputData: "ac" },
      { input: "s = \"racecar\"", expected: "racecar", inputData: "racecar" },
      { input: "s = \"abcdef\"", expected: "a", inputData: "abcdef" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function longestPalindrome(s) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def longestPalindrome(s):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public String longestPalindrome(String s) {\n        // Write your solution here\n    }\n}" }
    ]
  },
  {
    time: 90,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"],
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merge all lists" }],
    testCases: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", expected: "[1,1,2,3,4,4,5,6]", inputData: "[[1,4,5],[1,3,4],[2,6]]" },
      { input: "lists = []", expected: "[]", inputData: "[]" },
      { input: "lists = [[]]", expected: "[]", inputData: "[[]]" },
      { input: "lists = [[1],[2],[3]]", expected: "[1,2,3]", inputData: "[[1],[2],[3]]" },
      { input: "lists = [[1,2,3],[4,5,6]]", expected: "[1,2,3,4,5,6]", inputData: "[[1,2,3],[4,5,6]]" }
    ],
    defaultCode: [
      { language: "JavaScript", code: "function mergeKLists(lists) {\n  // Write your solution here\n}" },
      { language: "Python", code: "def mergeKLists(lists):\n    # Write your solution here\n    pass" },
      { language: "Java", code: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n    }\n}" }
    ]
  }
];