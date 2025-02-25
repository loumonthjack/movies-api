import Database from "../models";
import Helper from "../helpers";

const ITEMS_PER_PAGE = 50;

export const getAllMovies = async (page: number) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const [movies, [items]] = await Database.getMovies(ITEMS_PER_PAGE, offset);
  
    const totalItems = parseInt(items.count);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    return {
      data: movies.map((movie) => ({
        ...movie,
        genres: Helper.safeJsonParse(movie.genres),
        budget: Helper.formatBudgetToDollars(movie.budget)
      })),
      page,
      total_pages: totalPages,
      total_items: totalItems
    };
  };
