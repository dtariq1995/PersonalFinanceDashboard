using FinanceDashboard.Models;
using FinanceDashboard.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinanceDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesController : ControllerBase
    {
        private readonly RuleService _ruleService;

        public RulesController(RuleService ruleService)
        {
            _ruleService = ruleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Rule>>> GetAllRules()
        {
            var rules = await _ruleService.GetAllRulesAsync();
            return Ok(rules);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rule>> GetRuleById(int id)
        {
            var rule = await _ruleService.GetRuleByIdAsync(id);
            if (rule == null)
            {
                return NotFound();
            }
            return Ok(rule);
        }

        [HttpPost]
        public async Task<ActionResult> CreateRule(Rule rule)
        {
            var createdRule = await _ruleService.CreateRuleAsync(rule);
            return CreatedAtAction(nameof(GetRuleById), new { id = createdRule.Id }, createdRule);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRule(int id, Rule rule)
        {
            if (id != rule.Id)
            {
                return BadRequest();
            }
            var success = await _ruleService.UpdateRuleAsync(id, rule);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRule(int id)
        {
            var success = await _ruleService.DeleteRuleAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}