const STORAGE_KEY = "arcadia-library-transactions";

const baseBooks = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    shelf: "A-12",
    description: "A popular title for readers who enjoy imaginative fiction with emotional depth.",
    gradient: "linear-gradient(135deg, #6a4f45, #2e1c18)"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Growth",
    shelf: "B-03",
    description: "An easy recommendation for students looking to sharpen routines and productivity.",
    gradient: "linear-gradient(135deg, #7a6437, #34250f)"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    shelf: "C-08",
    description: "A science shelf favorite that keeps curiosity alive beyond the classroom.",
    gradient: "linear-gradient(135deg, #355365, #172733)"
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    shelf: "D-05",
    description: "Frequently borrowed by students interested in economics and personal finance.",
    gradient: "linear-gradient(135deg, #55643d, #23301b)"
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    shelf: "E-02",
    description: "A broad human history title that blends storytelling with big-picture analysis.",
    gradient: "linear-gradient(135deg, #85513b, #3a1e16)"
  },
  {
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    category: "Technology",
    shelf: "F-01",
    description: "Core technical reference for students handling algorithm and DSA coursework.",
    gradient: "linear-gradient(135deg, #3d5a73, #182632)"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Classics",
    shelf: "G-10",
    description: "A short inspirational classic that students often borrow during semester breaks.",
    gradient: "linear-gradient(135deg, #8d6a38, #433014)"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    shelf: "H-06",
    description: "Picked up often by exam-season readers who want better focus habits.",
    gradient: "linear-gradient(135deg, #59684f, #263020)"
  }
];

const seedTransactions = [
  {
    id: "tx-1001",
    bookTitle: "Atomic Habits",
    category: "Self Growth",
    studentName: "Aarav Sharma",
    studentId: "CSE-204",
    borrowDate: "2026-04-12",
    dueDate: "2026-04-26",
    returnDate: "",
    notes: "Borrowed for habit-building workshop."
  },
  {
    id: "tx-1002",
    bookTitle: "Sapiens",
    category: "History",
    studentName: "Priya Nair",
    studentId: "HIS-118",
    borrowDate: "2026-04-03",
    dueDate: "2026-04-17",
    returnDate: "",
    notes: "Reserved by humanities student."
  },
  {
    id: "tx-1003",
    bookTitle: "The Midnight Library",
    category: "Fiction",
    studentName: "Karan Mehta",
    studentId: "ENG-042",
    borrowDate: "2026-04-07",
    dueDate: "2026-04-20",
    returnDate: "2026-04-18",
    notes: "Returned in good condition."
  },
  {
    id: "tx-1004",
    bookTitle: "Introduction to Algorithms",
    category: "Technology",
    studentName: "Riya Verma",
    studentId: "IT-331",
    borrowDate: "2026-04-15",
    dueDate: "2026-04-29",
    returnDate: "",
    notes: "Needed for coding lab preparation."
  },
  {
    id: "tx-1005",
    bookTitle: "The Psychology of Money",
    category: "Finance",
    studentName: "Sameer Khan",
    studentId: "MBA-015",
    borrowDate: "2026-04-10",
    dueDate: "2026-04-24",
    returnDate: "2026-04-16",
    notes: "Returned early after seminar."
  }
];

const state = {
  category: "All",
  catalogSearch: "",
  ledgerSearch: "",
  ledgerFilter: "all",
  books: [...baseBooks],
  transactions: loadTransactions()
};

const elements = {
  heroLiveLoans: document.getElementById("hero-live-loans"),
  heroReturns: document.getElementById("hero-returns"),
  heroOverdue: document.getElementById("hero-overdue"),
  totalBooks: document.getElementById("total-books"),
  activeLoans: document.getElementById("active-loans"),
  returnedBooks: document.getElementById("returned-books"),
  dueSoon: document.getElementById("due-soon"),
  categoryChips: document.getElementById("category-chips"),
  catalogGrid: document.getElementById("catalog-grid"),
  catalogSearch: document.getElementById("catalog-search"),
  activeLoanList: document.getElementById("active-loan-list"),
  reminderList: document.getElementById("reminder-list"),
  activityFeed: document.getElementById("activity-feed"),
  entryForm: document.getElementById("entry-form"),
  formFeedback: document.getElementById("form-feedback"),
  insightList: document.getElementById("insight-list"),
  ledgerBody: document.getElementById("ledger-body"),
  statusFilters: document.getElementById("status-filters"),
  ledgerSearch: document.getElementById("ledger-search"),
  restoreDemo: document.getElementById("restore-demo"),
  bookList: document.getElementById("book-list"),
  hero: document.querySelector(".hero")
};

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneTransactions(seedTransactions);
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? cloneTransactions(parsed) : cloneTransactions(seedTransactions);
  } catch (error) {
    return cloneTransactions(seedTransactions);
  }
}

function cloneTransactions(records) {
  return records.map((record) => ({ ...record }));
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

function hydrateBooksFromTransactions() {
  state.books = [...baseBooks];

  state.transactions.forEach((transaction) => {
    const exists = state.books.some((book) => normalize(book.title) === normalize(transaction.bookTitle));

    if (!exists && transaction.bookTitle) {
      state.books.unshift({
        title: transaction.bookTitle,
        author: "Library Entry",
        category: transaction.category || "General",
        shelf: "New Arrival",
        description: "Added dynamically from the librarian borrow ledger.",
        gradient: "linear-gradient(135deg, #6a5c4b, #271e18)"
      });
    }
  });
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function parseDateString(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const date = parseDateString(dateString);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not returned";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getStatus(transaction) {
  if (transaction.returnDate) {
    return "returned";
  }

  if (transaction.dueDate && transaction.dueDate < todayString()) {
    return "overdue";
  }

  return "borrowed";
}

function getAvailability(book) {
  const activeRecord = state.transactions.find((transaction) => {
    return normalize(transaction.bookTitle) === normalize(book.title) && !transaction.returnDate;
  });

  if (!activeRecord) {
    return "available";
  }

  return getStatus(activeRecord);
}

function getCategories() {
  const categories = new Set(state.books.map((book) => book.category));
  return ["All", ...categories];
}

function filterBooks() {
  const query = normalize(state.catalogSearch);

  return state.books.filter((book) => {
    const matchesCategory = state.category === "All" || book.category === state.category;
    const matchesQuery = [book.title, book.author, book.category].some((value) => normalize(value).includes(query));
    return matchesCategory && matchesQuery;
  });
}

function getActiveTransactions() {
  return state.transactions
    .filter((transaction) => !transaction.returnDate)
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
}

function getRecentActivity() {
  return [...state.transactions]
    .sort((a, b) => {
      const latestA = a.returnDate || a.borrowDate || "";
      const latestB = b.returnDate || b.borrowDate || "";
      return latestB.localeCompare(latestA);
    })
    .slice(0, 6);
}

function getDueSoonRecords() {
  const today = todayString();
  const nextWeek = addDays(today, 7);

  return getActiveTransactions().filter((transaction) => {
    return transaction.dueDate && transaction.dueDate >= today && transaction.dueDate <= nextWeek;
  });
}

function getOverdueRecords() {
  return getActiveTransactions().filter((transaction) => getStatus(transaction) === "overdue");
}

function renderStats() {
  const active = getActiveTransactions();
  const returned = state.transactions.filter((transaction) => getStatus(transaction) === "returned");
  const overdue = getOverdueRecords();
  const dueSoon = getDueSoonRecords();

  setAnimatedNumber(elements.heroLiveLoans, active.length);
  setAnimatedNumber(elements.heroReturns, returned.length);
  setAnimatedNumber(elements.heroOverdue, overdue.length);

  setAnimatedNumber(elements.totalBooks, state.books.length);
  setAnimatedNumber(elements.activeLoans, active.length);
  setAnimatedNumber(elements.returnedBooks, returned.length);
  setAnimatedNumber(elements.dueSoon, dueSoon.length);
}

function setAnimatedNumber(element, value) {
  const nextValue = Number(value) || 0;
  const currentValue = Number(element.dataset.value || 0);

  if (currentValue === nextValue) {
    element.textContent = String(nextValue);
    return;
  }

  const duration = 700;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const displayValue = Math.round(currentValue + (nextValue - currentValue) * progress);
    element.textContent = String(displayValue);

    if (progress < 1) {
      window.requestAnimationFrame(update);
    } else {
      element.dataset.value = String(nextValue);
    }
  }

  element.dataset.value = String(nextValue);
  window.requestAnimationFrame(update);
}

function renderCategoryChips() {
  const categories = getCategories();

  elements.categoryChips.innerHTML = categories
    .map((category) => {
      const classes = category === state.category ? "chip-btn chip-btn-active" : "chip-btn";
      return `<button type="button" class="${classes}" data-category="${category}">${category}</button>`;
    })
    .join("");
}

function renderCatalog() {
  const books = filterBooks();

  if (!books.length) {
    elements.catalogGrid.innerHTML = `
      <div class="empty-state">
        <strong>No books matched your search.</strong>
        <small>Try another title, author, or category to explore the catalog.</small>
      </div>
    `;
    return;
  }

  elements.catalogGrid.innerHTML = books
    .map((book) => {
      const availability = getAvailability(book);
      const availabilityLabel = availability === "available" ? "Available" : availability;

      return `
        <article class="book-card" style="--book-gradient: ${book.gradient}">
          <div class="book-card-header">
            <div>
              <h4>${book.title}</h4>
              <p>${book.author}</p>
            </div>
            <div class="badge-row">
              <span class="badge status-${availability}">${availabilityLabel}</span>
            </div>
          </div>
          <p>${book.description}</p>
          <div class="book-meta">
            <span>${book.category}</span>
            <span>${book.shelf}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderActiveLoans() {
  const active = getActiveTransactions();

  if (!active.length) {
    elements.activeLoanList.innerHTML = `
      <div class="empty-state">
        <strong>No active loans.</strong>
        <small>The ledger is clear right now.</small>
      </div>
    `;
    return;
  }

  elements.activeLoanList.innerHTML = active
    .slice(0, 5)
    .map((transaction) => {
      const status = getStatus(transaction);
      return `
        <article class="loan-item">
          <div>
            <h4>${transaction.bookTitle}</h4>
            <p>${transaction.studentName}</p>
          </div>
          <div class="meta-stack">
            <span>${transaction.studentId || "Student"}</span>
            <span>${formatDate(transaction.dueDate)}</span>
            <span class="status-pill status-${status}">${status}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderReminders() {
  const reminders = [...getOverdueRecords(), ...getDueSoonRecords()]
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 5);

  if (!reminders.length) {
    elements.reminderList.innerHTML = `
      <div class="empty-state">
        <strong>No return reminders.</strong>
        <small>There are no overdue or near-due books at the moment.</small>
      </div>
    `;
    return;
  }

  elements.reminderList.innerHTML = reminders
    .map((transaction) => {
      const status = getStatus(transaction);
      const label = status === "overdue" ? "Overdue now" : "Due soon";
      return `
        <article class="reminder-item">
          <div>
            <h4>${transaction.bookTitle}</h4>
            <p>${transaction.studentName}</p>
          </div>
          <div class="meta-stack">
            <span>${label}</span>
            <span>${formatDate(transaction.dueDate)}</span>
            <span class="status-pill status-${status}">${status}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderActivity() {
  const activity = getRecentActivity();

  elements.activityFeed.innerHTML = activity
    .map((transaction) => {
      const status = getStatus(transaction);
      const eventText = status === "returned"
        ? `Returned by ${transaction.studentName}`
        : `Borrowed by ${transaction.studentName}`;
      const eventDate = status === "returned" ? transaction.returnDate : transaction.borrowDate;

      return `
        <article class="activity-item">
          <div>
            <h4>${transaction.bookTitle}</h4>
            <p>${eventText}</p>
          </div>
          <div class="meta-stack">
            <span>${formatDate(eventDate)}</span>
            <span class="status-pill status-${status}">${status}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderInsights() {
  const active = getActiveTransactions();
  const overdue = getOverdueRecords();
  const categories = active.reduce((totals, transaction) => {
    const key = transaction.category || "General";
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const avgDuration = calculateAverageLoanDays();

  const insights = [
    {
      title: "Most active category",
      value: topCategory ? topCategory[0] : "Quiet shelves",
      note: topCategory ? `${topCategory[1]} active borrow records` : "No active circulation right now"
    },
    {
      title: "Average loan span",
      value: `${avgDuration} days`,
      note: "Computed from borrow and due dates"
    },
    {
      title: "Attention needed",
      value: overdue.length,
      note: overdue.length ? "Books marked overdue in the ledger" : "No overdue books at the moment"
    }
  ];

  elements.insightList.innerHTML = insights
    .map((insight) => {
      return `
        <article class="insight-card">
          <div>
            <span class="mini-label">${insight.title}</span>
            <p>${insight.note}</p>
          </div>
          <strong>${insight.value}</strong>
        </article>
      `;
    })
    .join("");
}

function calculateAverageLoanDays() {
  const spans = state.transactions
    .map((transaction) => {
      if (!transaction.borrowDate || !transaction.dueDate) {
        return null;
      }

      const start = parseDateString(transaction.borrowDate);
      const end = parseDateString(transaction.dueDate);
      const diff = Math.round((end - start) / 86400000);
      return diff > 0 ? diff : null;
    })
    .filter(Boolean);

  if (!spans.length) {
    return 0;
  }

  const total = spans.reduce((sum, value) => sum + value, 0);
  return Math.round(total / spans.length);
}

function renderBookList() {
  elements.bookList.innerHTML = state.books
    .map((book) => `<option value="${book.title}"></option>`)
    .join("");
}

function filterLedger() {
  const query = normalize(state.ledgerSearch);

  return state.transactions
    .filter((transaction) => {
      const status = getStatus(transaction);
      const matchesFilter = state.ledgerFilter === "all" || status === state.ledgerFilter;
      const matchesQuery = [transaction.bookTitle, transaction.studentName, transaction.studentId]
        .some((value) => normalize(value).includes(query));

      return matchesFilter && matchesQuery;
    })
    .sort((a, b) => (b.borrowDate || "").localeCompare(a.borrowDate || ""));
}

function renderLedger() {
  const rows = filterLedger();

  if (!rows.length) {
    elements.ledgerBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <strong>No matching ledger entries.</strong>
            <small>Adjust the filters or add a new librarian record.</small>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.ledgerBody.innerHTML = rows
    .map((transaction) => {
      const status = getStatus(transaction);
      const canMarkReturned = status !== "returned";

      return `
        <tr>
          <td data-label="Book Name">${transaction.bookTitle}</td>
          <td data-label="Student">${transaction.studentName}${transaction.studentId ? ` (${transaction.studentId})` : ""}</td>
          <td data-label="Taken">${formatDate(transaction.borrowDate)}</td>
          <td data-label="Due">${formatDate(transaction.dueDate)}</td>
          <td data-label="Returned">${transaction.returnDate ? formatDate(transaction.returnDate) : "Pending"}</td>
          <td data-label="Status"><span class="status-pill status-${status}">${status}</span></td>
          <td data-label="Action">
            <button type="button" class="action-btn mark-return-btn" data-id="${transaction.id}" ${canMarkReturned ? "" : "disabled"}>
              ${canMarkReturned ? "Mark Returned" : "Closed"}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderAll() {
  hydrateBooksFromTransactions();
  renderStats();
  renderCategoryChips();
  renderCatalog();
  renderActiveLoans();
  renderReminders();
  renderActivity();
  renderInsights();
  renderBookList();
  renderLedger();
}

function bindEvents() {
  elements.catalogSearch.addEventListener("input", (event) => {
    state.catalogSearch = event.target.value;
    renderCatalog();
  });

  elements.categoryChips.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }

    state.category = button.dataset.category;
    renderCategoryChips();
    renderCatalog();
  });

  elements.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(elements.entryForm);
    const entry = {
      id: `tx-${Date.now()}`,
      bookTitle: String(formData.get("bookTitle") || "").trim(),
      category: String(formData.get("category") || "").trim() || "General",
      studentName: String(formData.get("studentName") || "").trim(),
      studentId: String(formData.get("studentId") || "").trim(),
      borrowDate: String(formData.get("borrowDate") || "").trim(),
      dueDate: String(formData.get("dueDate") || "").trim(),
      returnDate: String(formData.get("returnDate") || "").trim(),
      notes: String(formData.get("notes") || "").trim()
    };

    const validationError = validateEntry(entry);
    if (validationError) {
      showFeedback(validationError, "error");
      return;
    }

    state.transactions.unshift(entry);
    saveTransactions();
    renderAll();
    resetFormDefaults();
    showFeedback(`Entry added for "${entry.bookTitle}" and synced to the dashboard.`, "success");
  });

  elements.statusFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
      return;
    }

    state.ledgerFilter = button.dataset.filter;
    updateStatusFilterButtons();
    renderLedger();
  });

  elements.ledgerSearch.addEventListener("input", (event) => {
    state.ledgerSearch = event.target.value;
    renderLedger();
  });

  elements.ledgerBody.addEventListener("click", (event) => {
    const button = event.target.closest(".mark-return-btn");
    if (!button) {
      return;
    }

    markReturned(button.dataset.id);
  });

  elements.restoreDemo.addEventListener("click", () => {
    state.transactions = cloneTransactions(seedTransactions);
    saveTransactions();
    renderAll();
    resetFormDefaults();
    showFeedback("Demo library records restored.", "success");
  });

  const borrowDateInput = elements.entryForm.elements.borrowDate;
  const dueDateInput = elements.entryForm.elements.dueDate;

  borrowDateInput.addEventListener("change", () => {
    if (!dueDateInput.value || dueDateInput.value < borrowDateInput.value) {
      dueDateInput.value = addDays(borrowDateInput.value, 14);
    }
  });

  elements.hero.addEventListener("pointermove", (event) => {
    const rect = elements.hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    elements.hero.style.setProperty("--pointer-x", `${x}%`);
    elements.hero.style.setProperty("--pointer-y", `${y}%`);
  });
}

function validateEntry(entry) {
  if (!entry.bookTitle) {
    return "Book name is required.";
  }

  if (!entry.studentName) {
    return "Student name is required.";
  }

  if (!entry.borrowDate || !entry.dueDate) {
    return "Borrow and due dates are required.";
  }

  if (entry.dueDate < entry.borrowDate) {
    return "Due date cannot be earlier than the borrow date.";
  }

  if (entry.returnDate && entry.returnDate < entry.borrowDate) {
    return "Return date cannot be earlier than the borrow date.";
  }

  return "";
}

function showFeedback(message, type) {
  elements.formFeedback.textContent = message;
  elements.formFeedback.className = `form-feedback ${type}`;
}

function updateStatusFilterButtons() {
  const buttons = elements.statusFilters.querySelectorAll("[data-filter]");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.ledgerFilter);
  });
}

function markReturned(id) {
  const transaction = state.transactions.find((record) => record.id === id);
  if (!transaction || transaction.returnDate) {
    return;
  }

  transaction.returnDate = todayString();
  saveTransactions();
  renderAll();
  showFeedback(`Marked "${transaction.bookTitle}" as returned today.`, "success");
}

function resetFormDefaults() {
  elements.entryForm.reset();
  elements.entryForm.elements.borrowDate.value = todayString();
  elements.entryForm.elements.dueDate.value = addDays(todayString(), 14);
  elements.entryForm.elements.category.value = "General";
}

function setupRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((element) => observer.observe(element));
}

resetFormDefaults();
updateStatusFilterButtons();
renderAll();
bindEvents();
setupRevealAnimations();
