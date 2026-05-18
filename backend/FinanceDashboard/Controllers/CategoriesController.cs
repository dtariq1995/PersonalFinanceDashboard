using FinanceDashboard.Services;
using FinanceDashboard.Models;
using Microsoft.AspNetCore.Mvc;

namespace FinanceDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryByID(int id)
        {
            var category = await _categoryService.GetCategoryByIDAsync(id);
            if (category == null)        {
                return NotFound();
            }
            return Ok(category);
        }
        [HttpPost]
        public async Task<ActionResult> AddCategory(Category category)
        {
            await _categoryService.AddCategoryAsync(category);
            return CreatedAtAction(nameof(GetCategoryByID), new { id = category.Id }, category);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, Category category)
        {
            if (id != category.Id)        
            {
                return BadRequest();
            }
            var existingCategory = await _categoryService.GetCategoryByIDAsync(id);
            if (existingCategory == null)        {
                return NotFound();
            }
            await _categoryService.UpdateCategoryAsync(category);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {        var existingCategory = await _categoryService.GetCategoryByIDAsync(id);
            if (existingCategory == null) 
            {
                return NotFound();
            }
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
    }   
}

    